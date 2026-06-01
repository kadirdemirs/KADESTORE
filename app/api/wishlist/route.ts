import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getUser(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  return prisma.user.findUnique({ where: { email: session.user.email } });
}

export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await (prisma as any).wishlist.findMany({
    where: { userId: user.id },
    include: { game: { include: { _count: { select: { keys: { where: { isUsed: false } } } } } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { gameId } = await req.json();
  if (!gameId) return NextResponse.json({ error: "gameId gerekli" }, { status: 400 });

  await (prisma as any).wishlist.upsert({
    where: { userId_gameId: { userId: user.id, gameId } },
    update: {},
    create: { userId: user.id, gameId },
  });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");
  if (!gameId) return NextResponse.json({ error: "gameId gerekli" }, { status: 400 });

  await (prisma as any).wishlist.deleteMany({
    where: { userId: user.id, gameId },
  });
  return NextResponse.json({ success: true });
}
