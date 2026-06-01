import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateShopierForm } from "@/lib/shopier";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });
  }

  const { gameId, couponCode } = await req.json();
  if (!gameId) return NextResponse.json({ error: "gameId gerekli" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });

  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game || !game.isActive) {
    return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
  }

  const keyCount = await prisma.gameKey.count({ where: { gameId, isUsed: false } });
  if (keyCount === 0) {
    return NextResponse.json({ error: "Bu oyun için stokta anahtar yok." }, { status: 400 });
  }

  // Kupon backend doğrulaması
  let appliedCouponId: string | null = null;
  let discountAmount = 0;
  let finalPrice = game.price;

  if (couponCode && typeof couponCode === "string") {
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode.trim().toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "Geçersiz veya pasif kupon." }, { status: 400 });
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Kupon süresi dolmuş." }, { status: 400 });
    }
    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: "Kupon kullanım limiti dolmuş." }, { status: 400 });
    }
    if (coupon.minAmount > 0 && game.price < coupon.minAmount) {
      return NextResponse.json({ error: `Minimum sipariş tutarı ₺${coupon.minAmount.toFixed(2)}.` }, { status: 400 });
    }
    const alreadyUsed = await prisma.couponUsage.findFirst({
      where: { couponId: coupon.id, userId: user.id },
    });
    if (alreadyUsed) {
      return NextResponse.json({ error: "Bu kuponu daha önce kullandınız." }, { status: 400 });
    }

    discountAmount = coupon.type === "percent"
      ? Math.min(game.price * (coupon.value / 100), game.price)
      : Math.min(coupon.value, game.price);
    finalPrice = parseFloat((game.price - discountAmount).toFixed(2));
    appliedCouponId = coupon.id;
  }

  // Bekleyen sipariş — indirim alanları ile birlikte
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      gameId: game.id,
      price: finalPrice,
      originalPrice: game.price,
      discountAmount,
      couponId: appliedCouponId,
      status: "pending",
    },
  });

  const [firstName, ...rest] = user.name.split(" ");
  const lastName = rest.join(" ") || "Kullanıcı";

  const { actionUrl, fields } = generateShopierForm({
    orderId: order.id,
    productName: game.title,
    buyerName: firstName,
    buyerSurname: lastName,
    buyerEmail: user.email,
    totalPrice: finalPrice, // ⭐ indirimli fiyat Shopier'a gidiyor
    callbackUrl: `${process.env.NEXTAUTH_URL}/api/payment/callback`,
  });

  return NextResponse.json({ actionUrl, fields, orderId: order.id, finalPrice });
}
