import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyShopierCallback } from "@/lib/shopier";
import { rankFromPoints } from "@/lib/utils";
import { sendOrderConfirmation, sendLowStockAlert } from "@/lib/email";

// Shopier hem GET hem POST callback gönderebilir
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
    // POST JSON denemesi
    try {
      const body = await req.json();
      params = { ...params, ...body };
    } catch {}
  }

  const { platform_order_id, status, payment_id, random_nr, signature } = params;

  if (!platform_order_id) {
    return NextResponse.json({ error: "platform_order_id eksik" }, { status: 400 });
  }

  // İmza doğrulama (Shopier API secret ayarlanmışsa)
  const apiSecret = process.env.SHOPIER_API_SECRET;
  if (apiSecret && apiSecret !== "YOUR_SHOPIER_API_SECRET" && signature) {
    const valid = verifyShopierCallback({ platform_order_id, status, payment_id, random_nr, signature });
    if (!valid) {
      console.error("Shopier imza doğrulaması başarısız:", params);
      return NextResponse.json({ error: "Geçersiz imza" }, { status: 403 });
    }
  }

  // Ödeme başarılı mı?
  const paymentSuccess = status === "1" || status === "success" || status === "approved";
  if (!paymentSuccess) {
    // Başarısız: siparişi iptal et
    await prisma.order.update({
      where: { id: platform_order_id },
      data: { status: "failed" },
    }).catch(() => {});
    return NextResponse.json({ success: false, message: "Ödeme başarısız" });
  }

  // Mevcut siparişi getir
  const order = await prisma.order.findUnique({
    where: { id: platform_order_id },
    include: { user: true, game: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
  }

  if (order.status === "completed") {
    return NextResponse.json({ success: true, message: "Sipariş zaten tamamlandı" });
  }

  // Kullanılmamış anahtar al
  const availableKey = await prisma.gameKey.findFirst({
    where: { gameId: order.gameId, isUsed: false },
  });

  if (!availableKey) {
    console.error("Stokta anahtar yok! Sipariş:", order.id);
    await prisma.order.update({ where: { id: order.id }, data: { status: "no_stock" } });
    return NextResponse.json({ error: "Stokta anahtar yok" }, { status: 500 });
  }

  const newPoints = order.user.points + 1;
  const newRank = rankFromPoints(newPoints);

  // Transaction: siparişi tamamla, anahtarı kullanıldı olarak işaretle, kullanıcıya ata
  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: { status: "completed" },
    }),
    prisma.gameKey.update({
      where: { id: availableKey.id },
      data: { isUsed: true },
    }),
    prisma.user.update({
      where: { id: order.userId },
      data: { points: newPoints, rank: newRank },
    }),
  ]);

  await prisma.userKey.create({
    data: {
      userId: order.userId,
      gameKeyId: availableKey.id,
      orderId: order.id,
    },
  }).catch(() => {});

  // E-posta gönder (hata olursa sipariş etkilenmesin)
  sendOrderConfirmation({
    to: order.user.email,
    name: order.user.name,
    gameTitle: order.game.title,
    platform: order.game.platform,
    key: availableKey.key,
    price: order.price,
    orderId: order.id,
  }).catch(() => {});

  // Stok uyarısı kontrolü
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
