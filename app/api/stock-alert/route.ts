import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Kullanıcı yok" }, { status: 404 });

  const { gameId } = await req.json();
  if (!gameId) return NextResponse.json({ error: "gameId gerekli" }, { status: 400 });

  await (prisma as any).stockAlert.upsert({
    where: { userId_gameId: { userId: user.id, gameId } },
    update: { notified: false },
    create: { userId: user.id, gameId },
  });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Kullanıcı yok" }, { status: 404 });
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");
  if (!gameId) return NextResponse.json({ error: "gameId gerekli" }, { status: 400 });

  await (prisma as any).stockAlert.deleteMany({ where: { userId: user.id, gameId } });
  return NextResponse.json({ success: true });
}
