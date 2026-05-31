import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getShopierOrders } from "@/lib/shopier";
import { rankFromPoints } from "@/lib/utils";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = process.env.SHOPIER_API_TOKEN;
  if (!token) return NextResponse.json({ error: "SHOPIER_API_TOKEN ayarlanmamış." }, { status: 400 });

  let synced = 0;
  let errors: string[] = [];

  try {
    const data = await getShopierOrders();
    const shopierOrders = data?.data || data?.orders || [];

    for (const so of shopierOrders) {
      const platformOrderId = so.platform_order_id || so.id;
      if (!platformOrderId) continue;

      // Zaten işlenmiş mi?
      const existing = await prisma.order.findFirst({ where: { id: platformOrderId, status: "completed" } });
      if (existing) continue;

      // Bekleyen sipariş var mı?
      const pending = await prisma.order.findFirst({ where: { id: platformOrderId, status: "pending" } });
      if (!pending) continue;

      // Ödeme başarılı mı?
      if (so.status !== "1" && so.status !== "success" && so.payment_status !== "paid") continue;

      const availableKey = await prisma.gameKey.findFirst({ where: { gameId: pending.gameId, isUsed: false } });
      if (!availableKey) { errors.push(`Stok yok: ${platformOrderId}`); continue; }

      const user = await prisma.user.findUnique({ where: { id: pending.userId }, include: { orders: false } });
      if (!user) continue;

      const newPoints = user.points + 1;
      const newRank = rankFromPoints(newPoints);

      await prisma.$transaction([
        prisma.order.update({ where: { id: pending.id }, data: { status: "completed" } }),
        prisma.gameKey.update({ where: { id: availableKey.id }, data: { isUsed: true } }),
        prisma.user.update({ where: { id: user.id }, data: { points: newPoints, rank: newRank } }),
      ]);

      await prisma.userKey.create({ data: { userId: user.id, gameKeyId: availableKey.id, orderId: pending.id } }).catch(() => {});

      const game = await prisma.game.findUnique({ where: { id: pending.gameId } });
      if (game) {
        sendOrderConfirmation({ to: user.email, name: user.name, gameTitle: game.title, platform: game.platform, key: availableKey.key, price: pending.price, orderId: pending.id }).catch(() => {});
      }

      synced++;
    }
  } catch (err: any) {
    return NextResponse.json({ error: "Shopier API hatası: " + err.message, synced, errors }, { status: 500 });
  }

  return NextResponse.json({ success: true, synced, errors, message: `${synced} sipariş senkronize edildi.` });
}
