import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key) return NextResponse.json({ valid: false, error: "Anahtar belirtilmedi." });

  const gameKey = await prisma.gameKey.findUnique({
    where: { key },
    include: { game: { select: { title: true, platform: true } } },
  });

  if (!gameKey) return NextResponse.json({ valid: false, error: "Bu anahtar bulunamadı." });

  return NextResponse.json({
    valid: true,
    game: gameKey.game.title,
    platform: gameKey.game.platform,
    used: gameKey.isUsed,
  });
}
