import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          keys: true,
          orders: true,
        },
      },
    },
    orderBy: { title: "asc" },
  });

  const stock = await Promise.all(
    games.map(async (game) => {
      const [available, used] = await Promise.all([
        prisma.gameKey.count({ where: { gameId: game.id, isUsed: false } }),
        prisma.gameKey.count({ where: { gameId: game.id, isUsed: true } }),
      ]);
      return {
        id: game.id,
        title: game.title,
        platform: game.platform,
        genre: game.genre,
        price: game.price,
        isActive: game.isActive,
        total: available + used,
        available,
        used,
      };
    })
  );

  // Stoğu azdan çoğa sırala (kritikler üstte)
  stock.sort((a, b) => a.available - b.available);

  return NextResponse.json({ stock });
}
