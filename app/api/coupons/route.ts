import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { usages: true } } } });
  return NextResponse.json({ coupons });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { code, type, value, minAmount, maxUses, expiresAt } = body;
  if (!code || !value) return NextResponse.json({ error: "Kod ve değer zorunludur." }, { status: 400 });
  const coupon = await prisma.coupon.create({
    data: {
      code: code.trim().toUpperCase(),
      type: type || "percent",
      value: parseFloat(value),
      minAmount: parseFloat(minAmount || "0"),
      maxUses: parseInt(maxUses || "0"),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });
  return NextResponse.json({ coupon }, { status: 201 });
}
