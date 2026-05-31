import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });

  const { code, price } = await req.json();
  if (!code) return NextResponse.json({ error: "Kupon kodu gerekli." }, { status: 400 });

  const coupon = await prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });

  if (!coupon || !coupon.isActive) return NextResponse.json({ error: "Geçersiz veya pasif kupon." }, { status: 404 });
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return NextResponse.json({ error: "Kupon süresi dolmuş." }, { status: 400 });
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) return NextResponse.json({ error: "Kupon kullanım limiti dolmuş." }, { status: 400 });
  if (price && coupon.minAmount > 0 && price < coupon.minAmount) return NextResponse.json({ error: `Minimum sipariş tutarı ₺${coupon.minAmount.toFixed(2)}.` }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const alreadyUsed = await prisma.couponUsage.findFirst({ where: { couponId: coupon.id, userId: user?.id } });
  if (alreadyUsed) return NextResponse.json({ error: "Bu kuponu daha önce kullandınız." }, { status: 400 });

  const discount = coupon.type === "percent"
    ? Math.min((price || 0) * (coupon.value / 100), price || 0)
    : Math.min(coupon.value, price || 0);

  return NextResponse.json({
    valid: true,
    couponId: coupon.id,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discount: parseFloat(discount.toFixed(2)),
    finalPrice: parseFloat(((price || 0) - discount).toFixed(2)),
  });
}
