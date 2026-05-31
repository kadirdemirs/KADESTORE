import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [allOrders, totalUsers, topGames, platformOrders] = await Promise.all([
    prisma.order.findMany({
      where: { status: "completed", createdAt: { gte: thirtyDaysAgo } },
      include: { game: { select: { title: true, platform: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.user.count(),
    prisma.order.groupBy({
      by: ["gameId"],
      where: { status: "completed" },
      _count: { gameId: true },
      _sum: { price: true },
      orderBy: { _count: { gameId: "desc" } },
      take: 5,
    }),
    prisma.order.findMany({ where: { status: "completed" }, include: { game: { select: { platform: true } } } }),
  ]);

  // Günlük gelir
  const dailyMap = new Map<string, { revenue: number; count: number }>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dailyMap.set(key, { revenue: 0, count: 0 });
  }
  for (const o of allOrders) {
    const key = o.createdAt.toISOString().slice(0, 10);
    if (dailyMap.has(key)) {
      const entry = dailyMap.get(key)!;
      entry.revenue += o.price;
      entry.count++;
    }
  }
  const dailyRevenue = Array.from(dailyMap.entries()).map(([date, v]) => ({ date, revenue: parseFloat(v.revenue.toFixed(2)) }));
  const dailyOrders = Array.from(dailyMap.entries()).map(([date, v]) => ({ date, count: v.count }));

  // Platform dağılımı
  const platformMap = new Map<string, number>();
  for (const o of platformOrders) {
    const p = o.game.platform;
    platformMap.set(p, (platformMap.get(p) || 0) + 1);
  }
  const platformBreakdown = Array.from(platformMap.entries()).map(([platform, count]) => ({ platform, count }));

  // En çok satan oyunlar
  const gameIds = topGames.map(g => g.gameId);
  const gameDetails = await prisma.game.findMany({ where: { id: { in: gameIds } }, select: { id: true, title: true } });
  const gameMap = new Map(gameDetails.map(g => [g.id, g.title]));
  const topGamesResult = topGames.map(g => ({
    title: gameMap.get(g.gameId) || g.gameId,
    orders: g._count.gameId,
    revenue: g._sum.price || 0,
  }));

  const totalRevenue = await prisma.order.aggregate({ where: { status: "completed" }, _sum: { price: true } });
  const totalOrders = await prisma.order.count({ where: { status: "completed" } });
  const monthOrders = await prisma.order.aggregate({ where: { status: "completed", createdAt: { gte: startOfMonth } }, _sum: { price: true } });

  return NextResponse.json({
    totalRevenue: totalRevenue._sum.price || 0,
    totalOrders,
    totalUsers,
    monthRevenue: monthOrders._sum.price || 0,
    dailyRevenue,
    dailyOrders,
    platformBreakdown,
    topGames: topGamesResult,
  });
}
