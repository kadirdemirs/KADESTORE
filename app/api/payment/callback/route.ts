import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyShopierCallback } from "@/lib/shopier";
import { rankFromPoints } from "@/lib/utils";
import { sendOrderConfirmation, sendLowStockAlert } from "@/lib/email";

// Idempotency cache (in-memory; production'da Redis kullan)
const processedCallbacks = new Map<string, number>();
const IDEMPOTENCY_TTL = 24 * 60 * 60 * 1000;

function isDuplicate(key: string): boolean {
  const now = Date.now();
  // Eski kayıtları temizle
  for (const [k, t] of processedCallbacks.entries()) {
    if (now - t > IDEMPOTENCY_TTL) processedCallbacks.delete(k);
  }
  if (processedCallbacks.has(key)) return true;
  processedCallbacks.set(key, now);
  return false;
}

export async function POST(req: NextRequest) {
  return handleCallback(req);
}
export async function GET(req: NextRequest) {
  return handleCallback(req);
}

async function handleCallback(req: NextRequest) {
  let params: Record<string, string> = {};

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const text = await req.text();
    new URLSearchParams(text).forEach((v, k) => { params[k] = v; });
  } else {
    const { searchParams } = new URL(req.url);
    searchParams.forEach((v, k) => { params[k] = v; });
    try {
      const body = await req.json();
      params = { ...params, ...body };
    } catch {}
  }

  const { platform_order_id, status, payment_id, random_nr, signature } = params;

  if (!platform_order_id) {
    return NextResponse.json({ error: "platform_order_id eksik" }, { status: 400 });
  }

  // Idempotency: aynı (order + random_nr) ikinci kez gelirse görmezden gel
  const idempotencyKey = `${platform_order_id}:${random_nr || payment_id || ""}`;
  if (isDuplicate(idempotencyKey)) {
    return NextResponse.json({ success: true, message: "Zaten işlendi (idempotency)" });
  }

  // İmza doğrulama
  const apiSecret = process.env.SHOPIER_API_SECRET;
  if (apiSecret && apiSecret !== "YOUR_SHOPIER_API_SECRET" && signature) {
    const valid = verifyShopierCallback({ platform_order_id, status, payment_id, random_nr, signature });
    if (!valid) {
      console.error("Shopier imza doğrulaması başarısız:", params);
      return NextResponse.json({ error: "Geçersiz imza" }, { status: 403 });
    }
  }

  const paymentSuccess = status === "1" || status === "success" || status === "approved";
  if (!paymentSuccess) {
    await prisma.order.update({
      where: { id: platform_order_id },
      data: { status: "failed" },
    }).catch(() => {});
    return NextResponse.json({ success: false, message: "Ödeme başarısız" });
  }

  const order = await prisma.order.findUnique({
    where: { id: platform_order_id },
    include: { user: true, game: true, coupon: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
  }
  if (order.status === "completed") {
    return NextResponse.json({ success: true, message: "Sipariş zaten tamamlandı" });
  }

  // ⭐ Atomic key allocation: updateMany ile koşullu update
  const candidate = await prisma.gameKey.findFirst({
    where: { gameId: order.gameId, isUsed: false },
  });
  if (!candidate) {
    console.error("Stokta anahtar yok! Sipariş:", order.id);
    await prisma.order.update({ where: { id: order.id }, data: { status: "no_stock" } });
    return NextResponse.json({ error: "Stokta anahtar yok" }, { status: 500 });
  }

  // Sadece hâlâ kullanılmamışsa güncelle (race condition koruması)
  const claimResult = await prisma.gameKey.updateMany({
    where: { id: candidate.id, isUsed: false },
    data: { isUsed: true },
  });
  if (claimResult.count === 0) {
    // Başka bir callback aldı, yeniden dene
    const retry = await prisma.gameKey.findFirst({
      where: { gameId: order.gameId, isUsed: false },
    });
    if (!retry) {
      await prisma.order.update({ where: { id: order.id }, data: { status: "no_stock" } });
      return NextResponse.json({ error: "Stokta anahtar yok" }, { status: 500 });
    }
    const r2 = await prisma.gameKey.updateMany({
      where: { id: retry.id, isUsed: false },
      data: { isUsed: true },
    });
    if (r2.count === 0) {
      return NextResponse.json({ error: "Anahtar tahsis edilemedi" }, { status: 500 });
    }
    candidate.id = retry.id;
    candidate.key = retry.key;
  }

  const newPoints = order.user.points + 1;
  const newRank = rankFromPoints(newPoints);

  // Transaction: sipariş tamamla + kullanıcı puan/rank + (kupon kullanımı varsa kaydet)
  const txOps: any[] = [
    prisma.order.update({
      where: { id: order.id },
      data: { status: "completed" },
    }),
    prisma.user.update({
      where: { id: order.userId },
      data: { points: newPoints, rank: newRank },
    }),
  ];

  if (order.couponId) {
    txOps.push(
      prisma.couponUsage.create({
        data: { couponId: order.couponId, userId: order.userId, orderId: order.id },
      }),
      prisma.coupon.update({
        where: { id: order.couponId },
        data: { usedCount: { increment: 1 } },
      }),
    );
  }

  await prisma.$transaction(txOps);

  await prisma.userKey.create({
    data: {
      userId: order.userId,
      gameKeyId: candidate.id,
      orderId: order.id,
    },
  }).catch(() => {});

  sendOrderConfirmation({
    to: order.user.email,
    name: order.user.name,
    gameTitle: order.game.title,
    platform: order.game.platform,
    key: candidate.key,
    price: order.price,
    orderId: order.id,
  }).catch(() => {});

  const remainingStock = await prisma.gameKey.count({ where: { gameId: order.gameId, isUsed: false } });
  const threshold = parseInt(process.env.LOW_STOCK_THRESHOLD || "3");
  if (remainingStock <= threshold) {
    const adminUsers = await prisma.user.findMany({ where: { role: "admin" }, select: { email: true } });
    for (const admin of adminUsers) {
      sendLowStockAlert({ to: admin.email, games: [{ title: order.game.title, available: remainingStock }] }).catch(() => {});
    }
  }

  return NextResponse.json({ success: true });
}
