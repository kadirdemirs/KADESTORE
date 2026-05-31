import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");
  const keys = await prisma.gameKey.findMany({
    where: { ...(gameId && { gameId }) },
    include: { game: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ keys });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { gameId, keys } = body;
  if (!gameId || !keys) return NextResponse.json({ error: "Eksik alan" }, { status: 400 });

  const keyList: string[] = Array.isArray(keys)
    ? keys
    : keys.split("\n").map((k: string) => k.trim()).filter(Boolean);

  const created = await prisma.gameKey.createMany({
    data: keyList.map((key: string) => ({ gameId, key })),
  });
  return NextResponse.json({ created: created.count }, { status: 201 });
}
