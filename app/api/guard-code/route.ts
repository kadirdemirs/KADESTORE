import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSteamGuardCode, getSecondsRemaining, isValidSharedSecret } from "@/lib/steam-guard";

// Sahip olunan bir hesabın Steam Guard kodunu sunucu tarafında üretir.
// shared_secret istemciye asla gönderilmez; yalnızca üretilen kod döner.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });

  const { userKeyId } = await req.json().catch(() => ({}));
  if (!userKeyId) {
    return NextResponse.json({ error: "userKeyId gerekli." }, { status: 400 });
  }

  // Kullanıcının gerçekten sahip olduğu hesabı doğrula
  const userKey = await prisma.userKey.findFirst({
    where: { id: userKeyId, userId: user.id },
    include: { gameKey: true },
  });

  if (!userKey) {
    return NextResponse.json({ error: "Bu hesap kütüphanenizde bulunamadı." }, { status: 404 });
  }

  const secret = userKey.gameKey.sharedSecret;
  if (!secret || !isValidSharedSecret(secret)) {
    return NextResponse.json(
      { error: "Bu ürün için Guard kodu mevcut değil." },
      { status: 400 }
    );
  }

  const code = getSteamGuardCode(secret);
  return NextResponse.json({
    code,
    secsLeft: getSecondsRemaining(),
    label: userKey.gameKey.steamUsername || "Steam Hesabı",
  });
}
