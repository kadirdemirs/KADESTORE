import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalUsers, totalGames, totalOrders, totalKeys, usedKeys, recentOrders] = await Promise.all([
    prisma.user.count(),
    prisma.game.count(),
    prisma.order.count(),
    prisma.gameKey.count(),
    prisma.gameKey.count({ where: { isUsed: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } }, game: { select: { title: true } } },
    }),
  ]);

  const revenue = await prisma.order.aggregate({ _sum: { price: true } });

  return NextResponse.json({
    totalUsers,
    totalGames,
    totalOrders,
    totalKeys,
    availableKeys: totalKeys - usedKeys,
    revenue: revenue._sum.price ?? 0,
    recentOrders,
  });
}
