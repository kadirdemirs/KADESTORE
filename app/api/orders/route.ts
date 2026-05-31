import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rankFromPoints } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const mine = searchParams.get("mine");

  if (mine === "1") {
    const user = await prisma.user.findUnique({ where: { email: session.user!.email! } });
    if (!user) return NextResponse.json({ orders: [] });
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: { game: { select: { title: true } }, userKey: { include: { gameKey: { select: { key: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders });
  }

  if ((session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      game: { select: { title: true } },
      userKey: { include: { gameKey: { select: { key: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { gameId } = await req.json();
  if (!gameId) return NextResponse.json({ error: "gameId gerekli" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });

  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game) return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });

  const availableKey = await prisma.gameKey.findFirst({ where: { gameId, isUsed: false } });
  if (!availableKey) return NextResponse.json({ error: "Bu oyun için stokta anahtar yok." }, { status: 400 });

  const newPoints = user.points + 1;
  const newRank = rankFromPoints(newPoints);

  const [order] = await prisma.$transaction([
    prisma.order.create({
      data: { userId: user.id, gameId, price: game.price, status: "completed" },
    }),
    prisma.gameKey.update({ where: { id: availableKey.id }, data: { isUsed: true } }),
    prisma.user.update({ where: { id: user.id }, data: { points: newPoints, rank: newRank } }),
  ]);

  await prisma.userKey.create({
    data: { userId: user.id, gameKeyId: availableKey.id, orderId: order.id },
  });

  return NextResponse.json({ success: true, key: availableKey.key, orderId: order.id });
}
