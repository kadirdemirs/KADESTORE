import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rankFromPoints } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });
  }

  const { key } = await req.json();
  if (!key?.trim()) {
    return NextResponse.json({ error: "Lütfen geçerli bir anahtar girin." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });

  const gameKey = await prisma.gameKey.findUnique({
    where: { key: key.trim().toUpperCase() },
    include: { game: true, userKey: true },
  });

  if (!gameKey) {
    return NextResponse.json({ error: "Bu anahtar bulunamadı. Lütfen kontrol edin." }, { status: 404 });
  }

  if (gameKey.isUsed || gameKey.userKey) {
    return NextResponse.json({ error: "Bu anahtar zaten kullanılmış." }, { status: 409 });
  }

  // Kullanıcı bu oyunu zaten aktive etmiş mi?
  const alreadyOwned = await prisma.userKey.findFirst({
    where: { userId: user.id, gameKey: { gameId: gameKey.gameId } },
  });
  if (alreadyOwned) {
    return NextResponse.json({ error: "Bu oyun zaten kütüphanenizde mevcut." }, { status: 409 });
  }

  const newPoints = user.points + 1;
  const newRank = rankFromPoints(newPoints);

  // Anahtarı kullanıldı olarak işaretle + kullanıcıya ata
  await prisma.$transaction([
    prisma.gameKey.update({ where: { id: gameKey.id }, data: { isUsed: true } }),
    prisma.user.update({ where: { id: user.id }, data: { points: newPoints, rank: newRank } }),
  ]);

  await prisma.userKey.create({
    data: {
      userId: user.id,
      gameKeyId: gameKey.id,
      source: "redeem",
    },
  });

  return NextResponse.json({
    success: true,
    game: {
      title: gameKey.game.title,
      platform: gameKey.game.platform,
      genre: gameKey.game.genre,
      imageUrl: gameKey.game.imageUrl,
    },
    key: gameKey.key,
    points: newPoints,
    rank: newRank,
  });
}
