import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      game: { select: { title: true, platform: true } },
      userKey: { include: { gameKey: { select: { key: true } } } },
    },
  });

  if (!order) return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
  if (order.userId !== user?.id && (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  return NextResponse.json({ order });
}

// Sipariş iptal — kullanıcı sadece kendi pending sipariş için, admin tüm pending için
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { action } = await req.json();

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Kullanıcı yok" }, { status: 404 });

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });

  const isAdmin = (session.user as any).role === "admin";
  if (order.userId !== user.id && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (action === "cancel") {
    if (order.status !== "pending") {
      return NextResponse.json({ error: "Sadece bekleyen siparişler iptal edilebilir." }, { status: 400 });
    }
    await prisma.order.update({ where: { id }, data: { status: "cancelled" } });
    return NextResponse.json({ success: true });
  }

  if (action === "refund" && isAdmin) {
    // Admin geri iade — anahtarı tekrar stoğa al
    if (order.status !== "completed") {
      return NextResponse.json({ error: "Sadece tamamlanmış sipariş iade edilebilir." }, { status: 400 });
    }
    const uk = await prisma.userKey.findFirst({ where: { orderId: order.id } });
    if (uk) {
      await prisma.$transaction([
        prisma.gameKey.update({ where: { id: uk.gameKeyId }, data: { isUsed: false } }),
        prisma.userKey.delete({ where: { id: uk.id } }),
        prisma.order.update({ where: { id }, data: { status: "refunded" } }),
      ]);
    } else {
      await prisma.order.update({ where: { id }, data: { status: "refunded" } });
    }
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
}
