"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

const EMPTY = { title: "", description: "", platform: "Steam", genre: "Aksiyon", price: "", imageUrl: "", isActive: true, isFeatured: false, deliveryType: "key" };

export default function AdminGamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/games?all=1");
    const data = await res.json();
    setGames(data.games || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm(EMPTY); setError(""); setShowForm(true); }
  function openEdit(game: any) {
    setEditing(game);
    setForm({ title: game.title, description: game.description, platform: game.platform, genre: game.genre, price: game.price, imageUrl: game.imageUrl, isActive: game.isActive, isFeatured: game.isFeatured, deliveryType: game.deliveryType || "key" });
    setError("");
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true); setError("");
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/games/${editing.id}` : "/api/games";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Hata"); setSaving(false); return; }
    setShowForm(false); load();
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu oyunu silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/games/${id}`, { method: "DELETE" });
    load();
  }

  const platforms = ["Steam", "Epic Games", "Xbox", "PlayStation", "Nintendo"];
  const genres = ["Aksiyon", "RPG", "Spor", "Strateji", "Simülasyon", "Bulmaca", "Macera"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Oyunlar</h1>
          <p className="text-gray-500 text-sm">{games.length} oyun</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-[#FFF785] hover:bg-[#FFF785] text-[#0a0a0a] px-4 py-2 rounded-xl text-sm font-medium transition">
          <Plus size={16} /> Oyun Ekle
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold text-white">{editing ? "Oyunu Düzenle" : "Yeni Oyun"}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              {error && <div className="bg-[#FFF785]/10 text-[#FFE74F] text-sm p-3 rounded-xl">{error}</div>}
              {[
                { label: "Oyun Adı", key: "title", type: "text", placeholder: "Oyun adı" },
                { label: "Görsel URL", key: "imageUrl", type: "text", placeholder: "https://..." },
                { label: "Fiyat (₺)", key: "price", type: "number", placeholder: "0.00" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-200 mb-1">{label}</label>
                  <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder}
                    className="w-full border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FFF785]" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Açıklama</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Oyun açıklaması"
                  className="w-full border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FFF785] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Platform</label>
                  <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}
                    className="w-full border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FFF785] bg-[#111111]">
                    {platforms.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Tür</label>
                  <select value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}
                    className="w-full border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FFF785] bg-[#111111]">
                    {genres.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Teslim Tipi</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { v: "key", title: "Ürün Anahtarı", desc: "Klasik anahtar teslimi" },
                    { v: "account", title: "Hazır Hesap", desc: "Kullanıcı adı/şifre + Guard" },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setForm({ ...form, deliveryType: opt.v })}
                      className={`text-left rounded-xl border px-3 py-2.5 transition ${
                        form.deliveryType === opt.v ? "border-[#FFF785] bg-[#FFF785]/10" : "border-white/10 hover:border-white/15"
                      }`}
                    >
                      <p className="text-sm font-semibold text-white">{opt.title}</p>
                      <p className="text-xs text-gray-500">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
                  Aktif
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded" />
                  Öne Çıkan
                </label>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-white/10 text-gray-200 py-2 rounded-xl text-sm hover:bg-[#0a0a0a] transition">İptal</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-[#FFF785] hover:bg-[#FFF785] text-[#0a0a0a] py-2 rounded-xl text-sm font-medium transition disabled:opacity-60">
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#111111] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Yükleniyor...</div>
        ) : games.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Henüz oyun yok.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#0a0a0a] border-b border-white/5">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Oyun</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Platform</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tür</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Teslim</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Fiyat</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stok</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Durum</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {games.map((game) => (
                <tr key={game.id} className="hover:bg-[#0a0a0a] transition">
                  <td className="px-5 py-3 font-medium text-white max-w-48 truncate">{game.title}</td>
                  <td className="px-4 py-3 text-gray-500">{game.platform}</td>
                  <td className="px-4 py-3 text-gray-500">{game.genre}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${game.deliveryType === "account" ? "bg-blue-100 text-blue-700" : "bg-white/5 text-gray-600"}`}>
                      {game.deliveryType === "account" ? "Hesap" : "Anahtar"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#FFF785]">₺{game.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-500">{game._count?.keys ?? 0} adet</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${game.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-[#FFE74F]"}`}>
                      {game.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(game)} className="p-1.5 text-gray-500 hover:text-gray-600 hover:bg-white/5 rounded-lg transition"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(game.id)} className="p-1.5 text-gray-500 hover:text-[#FFF785] hover:bg-[#FFF785]/10 rounded-lg transition"><Trash2 size={14} /></button>
                    </div>
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
