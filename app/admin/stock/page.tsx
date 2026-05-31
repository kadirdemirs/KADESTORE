"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle, XCircle, Package, Wand2, Plus, TrendingDown, BarChart3 } from "lucide-react";

interface StockItem {
  id: string;
  title: string;
  platform: string;
  genre: string;
  price: number;
  isActive: boolean;
  total: number;
  available: number;
  used: number;
}

const THRESHOLDS = { critical: 0, low: 5 };

export default function AdminStockPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "critical" | "low" | "ok">("all");
  const [generating, setGenerating] = useState<string | null>(null);
  const [genCount, setGenCount] = useState<Record<string, string>>({});

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/stock");
    const data = await res.json();
    setItems(data.stock || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function quickGenerate(gameId: string) {
    setGenerating(gameId);
    const count = parseInt(genCount[gameId] || "10");
    await fetch("/api/keys/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, count, format: "steam" }),
    });
    await load();
    setGenerating(null);
  }

  function statusOf(item: StockItem) {
    if (item.available === 0) return "critical";
    if (item.available <= THRESHOLDS.low) return "low";
    return "ok";
  }

  const filtered = items.filter(i => filter === "all" || statusOf(i) === filter);
  const counts = {
    all: items.length,
    critical: items.filter(i => statusOf(i) === "critical").length,
    low: items.filter(i => statusOf(i) === "low").length,
    ok: items.filter(i => statusOf(i) === "ok").length,
  };

  const statusStyles = {
    critical: { bg: "bg-red-100", text: "text-red-700", label: "Stok Yok", icon: XCircle, bar: "bg-red-400" },
    low: { bg: "bg-amber-100", text: "text-amber-700", label: "Düşük Stok", icon: AlertTriangle, bar: "bg-amber-400" },
    ok: { bg: "bg-green-100", text: "text-green-700", label: "Yeterli", icon: CheckCircle, bar: "bg-green-500" },
  };

  const totalAvailable = items.reduce((a, i) => a + i.available, 0);
  const totalUsed = items.reduce((a, i) => a + i.used, 0);
  const totalKeys = items.reduce((a, i) => a + i.total, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stok Kontrolü</h1>
        <p className="text-gray-500 text-sm">Oyun başına anahtar stok durumu</p>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Toplam Oyun", value: items.length, color: "text-gray-900" },
          { label: "Kullanılabilir", value: totalAvailable, color: "text-green-600" },
          { label: "Kullanılmış", value: totalUsed, color: "text-blue-600" },
          { label: "Kritik Oyun", value: counts.critical, color: "text-red-600" },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className={`text-2xl font-black ${c.color}`}>{c.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Filtreler */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["all", "critical", "low", "ok"] as const).map(f => {
          const labels = { all: "Tümü", critical: "Stok Yok", low: "Düşük Stok", ok: "Yeterli" };
          const colors = {
            all: "bg-gray-900 text-white",
            critical: "bg-red-500 text-white",
            low: "bg-amber-500 text-white",
            ok: "bg-green-500 text-white",
          };
          const inactive = "bg-white text-gray-600 border border-gray-200 hover:border-gray-300";
          return (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${filter === f ? colors[f] : inactive}`}>
              {labels[f]} <span className="text-xs opacity-75">({counts[f]})</span>
            </button>
          );
        })}
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Bu kategoride oyun yok.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Oyun</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stok Durumu</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Kullanılabilir</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Kullanılan</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Toplam</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Hızlı Ekle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(item => {
                const s = statusOf(item);
                const st = statusStyles[s];
                const Icon = st.icon;
                const pct = item.total > 0 ? (item.available / item.total) * 100 : 0;
                const isGenerating = generating === item.id;

                return (
                  <tr key={item.id} className={`hover:bg-gray-50 transition ${s === "critical" ? "bg-red-50/40" : ""}`}>
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-semibold text-gray-900 truncate max-w-48">{item.title}</p>
                        <div className="flex gap-1.5 mt-0.5">
                          <span className="text-xs text-gray-400">{item.platform}</span>
                          <span className="text-xs text-gray-300">·</span>
                          <span className="text-xs text-gray-400">₺{item.price.toFixed(0)}</span>
                        </div>
                        {/* stok çubuğu */}
                        <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden w-36">
                          <div className={`h-full rounded-full ${st.bar}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${st.bg} ${st.text}`}>
                        <Icon size={12} /> {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-lg font-black ${s === "critical" ? "text-red-500" : s === "low" ? "text-amber-500" : "text-green-600"}`}>
                        {item.available}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500 font-medium">{item.used}</td>
                    <td className="px-4 py-3 text-center text-gray-400">{item.total}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1" max="500"
                          value={genCount[item.id] || "10"}
                          onChange={e => setGenCount(c => ({ ...c, [item.id]: e.target.value }))}
                          className="w-14 border border-gray-200 rounded-lg px-2 py-1 text-xs text-center focus:outline-none focus:border-amber-400"
                        />
                        <button
                          onClick={() => quickGenerate(item.id)}
                          disabled={!!generating}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50 font-medium"
                        >
                          {isGenerating
                            ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            : <Wand2 size={12} />}
                          Üret
                        </button>
                        <Link
                          href="/admin/keys"
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                        >
                          <Plus size={12} /> Manuel
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Kritik oyunlar özeti */}
      {counts.critical > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <TrendingDown size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              {counts.critical} oyunun stoğu tükendi!
            </p>
            <p className="text-xs text-red-600 mt-0.5">
              Bu oyunlar için anahtar ekleyin veya otomatik üretin.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
