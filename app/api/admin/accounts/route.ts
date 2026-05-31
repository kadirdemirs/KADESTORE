import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidSharedSecret } from "@/lib/steam-guard";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return !!session && (session.user as any).role === "admin";
}

// Belirli bir oyunun hesap stoğunu listele (şifre maskeli, secret gizli)
export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const gameId = new URL(req.url).searchParams.get("gameId");
  if (!gameId) return NextResponse.json({ error: "gameId gerekli" }, { status: 400 });

  const rows = await prisma.gameKey.findMany({
    where: { gameId },
    orderBy: { createdAt: "desc" },
  });

  const accounts = rows.map((r) => ({
    id: r.id,
    key: r.key,
    isUsed: r.isUsed,
    steamUsername: r.steamUsername,
    hasPassword: Boolean(r.steamPassword),
    hasGuard: Boolean(r.sharedSecret),
    accountNote: r.accountNote,
    createdAt: r.createdAt,
  }));

  return NextResponse.json({ accounts });
}

// Toplu hesap ekle. Her satır: kullanıcıadı:şifre:sharedSecret(opsiyonel):not(opsiyonel)
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { gameId, bulk } = await req.json().catch(() => ({}));
  if (!gameId || !bulk?.trim()) {
    return NextResponse.json({ error: "gameId ve hesap verisi gerekli" }, { status: 400 });
  }

  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game) return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });

  const lines = bulk.split("\n").map((l: string) => l.trim()).filter(Boolean);
  const data: any[] = [];
  const errors: string[] = [];

  lines.forEach((line: string, idx: number) => {
    const parts = line.split(":");
    const username = (parts[0] || "").trim();
    const password = (parts[1] || "").trim();
    const secret = (parts[2] || "").trim();
    const note = (parts.slice(3).join(":") || "").trim();

    if (!username || !password) {
      errors.push(`Satır ${idx + 1}: kullanıcı adı ve şifre zorunlu.`);
      return;
    }
    if (secret && !isValidSharedSecret(secret)) {
      errors.push(`Satır ${idx + 1}: geçersiz shared_secret (base64, 20 byte olmalı).`);
      return;
    }

    data.push({
      gameId,
      // Referans kodu — anahtar alanı benzersiz olmalı
      key: `ACC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      steamUsername: username,
      steamPassword: password,
      sharedSecret: secret,
      accountNote: note,
    });
  });

  if (data.length === 0) {
    return NextResponse.json({ error: "Geçerli hesap bulunamadı.", details: errors }, { status: 400 });
  }

  const result = await prisma.gameKey.createMany({ data });

  // deliveryType henüz "account" değilse otomatik ayarla
  if (game.deliveryType !== "account") {
    await prisma.game.update({ where: { id: gameId }, data: { deliveryType: "account" } });
  }

  return NextResponse.json({ created: result.count, skipped: errors.length, errors });
}
