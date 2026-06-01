"use client";
import { useEffect, useState } from "react";
import { Users, Plus, Trash2, CheckCircle, XCircle, Shield, KeyRound } from "lucide-react";

interface GameOpt {
  id: string;
  title: string;
  platform: string;
  deliveryType: string;
}
interface AccountRow {
  id: string;
  steamUsername: string;
  hasPassword: boolean;
  hasGuard: boolean;
  isUsed: boolean;
  accountNote: string;
  createdAt: string;
}

export default function AdminAccountsPage() {
  const [games, setGames] = useState<GameOpt[]>([]);
  const [gameId, setGameId] = useState("");
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [bulk, setBulk] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/games?all=1")
      .then((r) => r.json())
      .then((d) => {
        setGames(d.games || []);
        if (d.games?.length) setGameId(d.games[0].id);
      });
  }, []);

  async function loadAccounts(id: string) {
    if (!id) return;
    setLoading(true);
    const res = await fetch(`/api/admin/accounts?gameId=${id}`);
    const data = await res.json();
    setAccounts(data.accounts || []);
    setLoading(false);
  }
  useEffect(() => { loadAccounts(gameId); }, [gameId]);

  async function handleAdd() {
    if (!gameId || !bulk.trim()) return;
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/admin/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, bulk }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg({ type: "err", text: (data.error || "Hata") + (data.details?.length ? ` (${data.details.join(" ")})` : "") });
    } else {
      setMsg({ type: "ok", text: `${data.created} hesap eklendi${data.skipped ? `, ${data.skipped} satır atlandı` : ""}.` });
      setBulk("");
      loadAccounts(gameId);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu hesabı silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/keys/${id}`, { method: "DELETE" });
    setAccounts((a) => a.filter((x) => x.id !== id));
  }

  const available = accounts.filter((a) => !a.isUsed).length;
  const selectedGame = games.find((g) => g.id === gameId);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Hesap Stoğu</h1>
        <p className="text-gray-500 text-sm">Hazır hesap teslimi yapılan oyunlar için kullanıcı bilgilerini yönetin.</p>
      </div>

      {/* Oyun seçimi + özet */}
      <div className="bg-[#111111] rounded-2xl border border-white/5 shadow-2xl p-5 mb-5">
        <label className="block text-sm font-medium text-gray-200 mb-1.5">Oyun</label>
        <select
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          className="w-full border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FFF785] bg-[#111111]"
        >
          {games.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title} — {g.platform} {g.deliveryType === "account" ? "(Hesap)" : "(Anahtar)"}
            </option>
          ))}
        </select>
        <div className="flex gap-4 mt-3 text-sm">
          <span className="text-gray-500">Toplam: <strong className="text-white">{accounts.length}</strong></span>
          <span className="text-green-600">Kullanılabilir: <strong>{available}</strong></span>
          <span className="text-blue-600">Teslim edilen: <strong>{accounts.length - available}</strong></span>
        </div>
      </div>

      {/* Toplu ekleme */}
      <div className="bg-[#111111] rounded-2xl border border-white/5 shadow-2xl p-5 mb-5">
        <h2 className="font-bold text-white flex items-center gap-2 mb-1">
          <Plus size={16} className="text-[#FFF785]" /> Toplu Hesap Ekle
        </h2>
        <p className="text-xs text-gray-500 mb-3">
          Her satıra bir hesap: <code className="bg-white/5 px-1.5 py-0.5 rounded">kullaniciadi:sifre:sharedSecret:not</code>
          {" "}— sharedSecret ve not isteğe bağlı.
        </p>
        <textarea
          value={bulk}
          onChange={(e) => setBulk(e.target.value)}
          rows={6}
          placeholder={"CovertDrake4654:Pass1234:base64secret==:Hesap 8\nNightOwl221:Gizli987"}
          className="w-full border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#FFF785] resize-none"
        />
        {msg && (
          <div className={`mt-3 text-sm p-3 rounded-xl ${msg.type === "ok" ? "bg-green-50 text-green-700" : "bg-[#FFF785]/10 text-[#FFE74F]"}`}>
            {msg.text}
          </div>
        )}
        <button
          onClick={handleAdd}
          disabled={saving || !bulk.trim()}
          className="mt-3 inline-flex items-center gap-2 bg-[#FFF785] hover:bg-[#FFF785] text-[#0a0a0a] px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-60"
        >
          <Plus size={15} /> {saving ? "Ekleniyor..." : "Hesapları Ekle"}
        </button>
      </div>

      {/* Liste */}
      <div className="bg-[#111111] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
          <Users size={16} className="text-gray-500" />
          <span className="text-sm font-semibold text-gray-200">{selectedGame?.title || "Hesaplar"}</span>
        </div>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Yükleniyor...</div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Bu oyun için hesap eklenmemiş.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#0a0a0a] border-b border-white/5">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Kullanıcı Adı</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Şifre</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Guard</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Durum</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Not</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {accounts.map((a) => (
                <tr key={a.id} className="hover:bg-[#0a0a0a] transition">
                  <td className="px-5 py-3 font-mono text-white">{a.steamUsername || "—"}</td>
                  <td className="px-4 py-3 text-center">
                    {a.hasPassword ? <KeyRound size={15} className="text-gray-500 mx-auto" /> : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {a.hasGuard ? <Shield size={15} className="text-blue-500 mx-auto" /> : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${a.isUsed ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                      {a.isUsed ? <><XCircle size={12} /> Teslim</> : <><CheckCircle size={12} /> Hazır</>}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-40 truncate">{a.accountNote || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(a.id)} disabled={a.isUsed}
                      className="p-1.5 text-gray-500 hover:text-[#FFF785] hover:bg-[#FFF785]/10 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed">
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
