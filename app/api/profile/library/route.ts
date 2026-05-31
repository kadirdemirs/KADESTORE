import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ library: [] });

  const rows = await prisma.userKey.findMany({
    where: { userId: user.id },
    include: {
      gameKey: {
        include: {
          game: { select: { title: true, platform: true, genre: true, imageUrl: true, slug: true, deliveryType: true } },
        },
      },
    },
    orderBy: { claimedAt: "desc" },
  });

  // shared_secret istemciye gönderilmez; yalnızca Guard kodunun mevcut olup olmadığı bilgisi paylaşılır.
  const library = rows.map((uk) => {
    const isAccount = uk.gameKey.game.deliveryType === "account";
    return {
      id: uk.id,
      source: uk.source,
      claimedAt: uk.claimedAt,
      deliveryType: uk.gameKey.game.deliveryType,
      gameKey: {
        // Hesap teslimi olmayan ürünlerde gerçek anahtarı göster
        key: isAccount ? null : uk.gameKey.key,
        steamUsername: isAccount ? uk.gameKey.steamUsername : null,
        steamPassword: isAccount ? uk.gameKey.steamPassword : null,
        accountNote: isAccount ? uk.gameKey.accountNote : null,
        hasGuard: isAccount ? Boolean(uk.gameKey.sharedSecret) : false,
        game: uk.gameKey.game,
      },
    };
  });

  return NextResponse.json({ library });
}
