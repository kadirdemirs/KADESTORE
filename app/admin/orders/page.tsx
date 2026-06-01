"use client";
import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => { setOrders(data.orders || []); setLoading(false); });
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Siparişler</h1>
        <p className="text-gray-500 text-sm">{orders.length} sipariş</p>
      </div>

      <div className="bg-[#111111] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Yükleniyor...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Sipariş bulunamadı.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#0a0a0a] border-b border-white/5">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Kullanıcı</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Oyun</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Anahtar</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Fiyat</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Durum</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-[#0a0a0a]">
                  <td className="px-5 py-3">
                    <p className="font-medium text-white">{order.user?.name}</p>
                    <p className="text-xs text-gray-500">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-200 max-w-36 truncate">{order.game?.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {order.userKey?.gameKey?.key || "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#FFF785]">₺{order.price?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">
                      {order.status === "completed" ? "Tamamlandı" : order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
