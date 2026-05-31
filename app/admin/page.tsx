import { prisma } from "@/lib/prisma";
import { Users, Gamepad2, ShoppingBag, Key, TrendingUp, DollarSign } from "lucide-react";

async function getStats() {
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
  return { totalUsers, totalGames, totalOrders, totalKeys, availableKeys: totalKeys - usedKeys, revenue: revenue._sum.price ?? 0, recentOrders };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Toplam Kullanıcı", value: stats.totalUsers, icon: Users, color: "bg-blue-100 text-blue-600" },
    { label: "Toplam Oyun", value: stats.totalGames, icon: Gamepad2, color: "bg-purple-100 text-purple-600" },
    { label: "Toplam Sipariş", value: stats.totalOrders, icon: ShoppingBag, color: "bg-green-100 text-green-600" },
    { label: "Mevcut Anahtar", value: stats.availableKeys, icon: Key, color: "bg-amber-100 text-amber-600" },
    { label: "Kullanılan Anahtar", value: stats.totalKeys - stats.availableKeys, icon: TrendingUp, color: "bg-red-100 text-red-600" },
    { label: "Toplam Gelir", value: `₺${stats.revenue.toFixed(2)}`, icon: DollarSign, color: "bg-emerald-100 text-emerald-600" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">KadeStore yönetim paneline hoş geldiniz.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{card.label}</p>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon size={18} />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Son Siparişler</h2>
        </div>
        {stats.recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">Henüz sipariş yok.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {stats.recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{order.user.name}</p>
                  <p className="text-xs text-gray-400">{order.game.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-500">₺{order.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
