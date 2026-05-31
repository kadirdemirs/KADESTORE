import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateKeys } from "@/lib/keygen";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { gameId, count, format, prefix } = body;

  if (!gameId) return NextResponse.json({ error: "gameId gerekli" }, { status: 400 });

  const n = Math.min(Math.max(parseInt(count) || 10, 1), 500);

  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game) return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });

  // Mevcut anahtarları çek (çakışmayı önlemek için)
  const existingKeys = await prisma.gameKey.findMany({
    where: { gameId },
    select: { key: true },
  });
  const existingSet = new Set(existingKeys.map((k) => k.key));

  // Yeni anahtarlar üret, çakışanları tekrar üret
  let generated: string[] = [];
  let attempts = 0;
  while (generated.length < n && attempts < n * 20) {
    const batch = generateKeys(n - generated.length, format || "steam", prefix);
    for (const k of batch) {
      if (!existingSet.has(k)) {
        existingSet.add(k);
        generated.push(k);
      }
    }
    attempts += batch.length;
  }

  if (generated.length === 0) {
    return NextResponse.json({ error: "Anahtar üretilemedi" }, { status: 500 });
  }

  const result = await prisma.gameKey.createMany({
    data: generated.map((key) => ({ gameId, key })),
  });

  return NextResponse.json({
    created: result.count,
    keys: generated,
    game: game.title,
  });
}
