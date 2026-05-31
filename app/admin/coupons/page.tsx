"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2, X, Tag, ToggleLeft, ToggleRight } from "lucide-react";

const EMPTY = { code: "", type: "percent", value: "", minAmount: "", maxUses: "", expiresAt: "" };

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/coupons");
    const data = await res.json();
    setCoupons(data.coupons || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleCreate() {
    setSaving(true); setError("");
    const res = await fetch("/api/coupons", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Hata"); setSaving(false); return; }
    setShowForm(false); setForm(EMPTY); load();
    setSaving(false);
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch(`/api/coupons/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !current }) });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kuponu silmek istiyor musunuz?")) return;
    await fetch(`/api/coupons/${id}`, { method: "DELETE" });
    load();
  }

  function generateCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kuponlar</h1>
          <p className="text-gray-500 text-sm">{coupons.length} kupon</p>
        </div>
        <button onClick={() => { setShowForm(true); setError(""); setForm(EMPTY); }}
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
          <Plus size={16} /> Kupon Oluştur
        </button>
      </div>

      {/* Oluşturma Modalı */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold text-gray-900">Yeni Kupon</h2>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl">{error}</div>}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kupon Kodu</label>
                <div className="flex gap-2">
                  <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="KADE2026" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400" />
                  <button onClick={() => setForm({ ...form, code: generateCode() })}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-medium transition">
                    Otomatik
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İndirim Türü</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white">
                    <option value="percent">Yüzde (%)</option>
                    <option value="fixed">Sabit (₺)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Değer {form.type === "percent" ? "(%)" : "(₺)"}
                  </label>
                  <input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}
                    placeholder={form.type === "percent" ? "10" : "50"} min="0" max={form.type === "percent" ? "100" : undefined}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min. Sipariş (₺)</label>
                  <input type="number" value={form.minAmount} onChange={e => setForm({ ...form, minAmount: e.target.value })}
                    placeholder="0" min="0"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maks. Kullanım</label>
                  <input type="number" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })}
                    placeholder="0 = sınırsız" min="0"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Son Kullanma Tarihi (isteğe bağlı)</label>
                <input type="datetime-local" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition">İptal</button>
              <button onClick={handleCreate} disabled={saving || !form.code || !form.value}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-60">
                {saving ? "Oluşturuluyor..." : "Oluştur"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kupon Listesi */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Tag size={28} className="mx-auto mb-2 opacity-30" />
            <p>Henüz kupon yok.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Kod</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">İndirim</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Kullanım</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Son Tarih</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Durum</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-lg">{c.code}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-amber-600">
                    {c.type === "percent" ? `%${c.value}` : `₺${c.value}`}
                    {c.minAmount > 0 && <span className="text-xs text-gray-400 font-normal ml-1">min ₺{c.minAmount}</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {c.usedCount} / {c.maxUses === 0 ? "∞" : c.maxUses}
                    <span className="text-xs text-gray-400 ml-1">({c._count?.usages ?? 0} kez)</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("tr-TR") : "Süresiz"}
                    {c.expiresAt && new Date(c.expiresAt) < new Date() && <span className="text-red-500 ml-1">✕ Doldu</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(c.id, c.isActive)}>
                      {c.isActive
                        ? <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium"><ToggleRight size={12} /> Aktif</span>
                        : <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium"><ToggleLeft size={12} /> Pasif</span>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 size={14} />
                    </button>
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
