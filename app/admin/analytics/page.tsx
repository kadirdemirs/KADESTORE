"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, DollarSign, ShoppingBag, Users, RefreshCw } from "lucide-react";

const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444"];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/analytics");
    const data = await res.json();
    setStats(data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function syncShopier() {
    setSyncing(true); setSyncMsg("");
    const res = await fetch("/api/shopier/sync", { method: "POST" });
    const data = await res.json();
    setSyncMsg(data.message || `${data.synced ?? 0} sipariş senkronize edildi.`);
    setSyncing(false);
    load();
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm">Satış ve gelir istatistikleri</p>
        </div>
        <div className="flex items-center gap-3">
          {syncMsg && <span className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full">{syncMsg}</span>}
          <button onClick={syncShopier} disabled={syncing}
            className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60">
            <RefreshCw size={15} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Senkronize..." : "Shopier Senkronize"}
          </button>
        </div>
      </div>

      {/* KPI kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Toplam Gelir", value: `₺${(stats?.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: "text-green-600 bg-green-100" },
          { label: "Toplam Sipariş", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "text-blue-600 bg-blue-100" },
          { label: "Aktif Kullanıcı", value: stats?.totalUsers || 0, icon: Users, color: "text-purple-600 bg-purple-100" },
          { label: "Bu Ay Gelir", value: `₺${(stats?.monthRevenue || 0).toFixed(2)}`, icon: TrendingUp, color: "text-amber-600 bg-amber-100" },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{c.label}</p>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.color}`}>
                <c.icon size={17} />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Günlük Gelir */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">Son 30 Gün — Günlük Gelir</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats?.dailyRevenue || []}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₺${v}`} />
              <Tooltip formatter={(v: any) => [`₺${v}`, "Gelir"]} labelFormatter={l => l} />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sipariş Trendi */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">Son 30 Gün — Sipariş Sayısı</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats?.dailyOrders || []}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip formatter={(v: any) => [v, "Sipariş"]} />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform dağılımı */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">Platform Dağılımı</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stats?.platformBreakdown || []} dataKey="count" nameKey="platform" cx="50%" cy="50%" outerRadius={80} label={(props: any) => `${props.platform} ${((props.percent ?? 0) * 100).toFixed(0)}%`}>
                {(stats?.platformBreakdown || []).map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* En çok satan oyunlar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">En Çok Satan Oyunlar</h2>
          <div className="space-y-3">
            {(stats?.topGames || []).map((g: any, i: number) => (
              <div key={g.title} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{g.title}</p>
                  <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(g.orders / (stats?.topGames?.[0]?.orders || 1)) * 100}%` }} />
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-700 flex-shrink-0">{g.orders} satış</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
