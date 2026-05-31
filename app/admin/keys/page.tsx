"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2, X, Wand2, Copy, Check, Download } from "lucide-react";
import { KEY_FORMATS } from "@/lib/keygen";

type Tab = "list" | "add" | "generate";

export default function AdminKeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("list");
  const [filterGame, setFilterGame] = useState("");

  // Manuel ekleme
  const [addGameId, setAddGameId] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  // Otomatik üretme
  const [genGameId, setGenGameId] = useState("");
  const [genCount, setGenCount] = useState("10");
  const [genFormat, setGenFormat] = useState("steam");
  const [genPrefix, setGenPrefix] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genResult, setGenResult] = useState<{ keys: string[]; game: string } | null>(null);
  const [genError, setGenError] = useState("");
  const [copied, setCopied] = useState(false);

  async function loadData() {
    setLoading(true);
    const [keysRes, gamesRes] = await Promise.all([
      fetch(`/api/keys${filterGame ? `?gameId=${filterGame}` : ""}`).then((r) => r.json()),
      fetch("/api/games?all=1").then((r) => r.json()),
    ]);
    setKeys(keysRes.keys || []);
    setGames(gamesRes.games || []);
    setLoading(false);
  }
  useEffect(() => { loadData(); }, [filterGame]);

  async function handleManualAdd() {
    setAddSaving(true); setAddError(""); setAddSuccess("");
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: addGameId, keys: keyInput }),
    });
    const data = await res.json();
    if (!res.ok) { setAddError(data.error || "Hata"); setAddSaving(false); return; }
    setAddSuccess(`✅ ${data.created} anahtar eklendi.`);
    setKeyInput(""); setAddGameId("");
    loadData();
    setAddSaving(false);
  }

  async function handleGenerate() {
    setGenLoading(true); setGenError(""); setGenResult(null);
    const res = await fetch("/api/keys/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId: genGameId,
        count: parseInt(genCount),
        format: genFormat,
        prefix: genFormat === "custom" ? genPrefix : undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) { setGenError(data.error || "Hata"); setGenLoading(false); return; }
    setGenResult(data);
    loadData();
    setGenLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu anahtarı silmek istiyor musunuz?")) return;
    await fetch(`/api/keys/${id}`, { method: "DELETE" });
    loadData();
  }

  function copyAllKeys() {
    if (!genResult) return;
    navigator.clipboard.writeText(genResult.keys.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadKeys() {
    if (!genResult) return;
    const blob = new Blob([genResult.keys.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${genResult.game.replace(/\s+/g, "_")}_keys.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "list", label: "Anahtar Listesi", icon: null },
    { id: "add", label: "Manuel Ekle", icon: Plus },
    { id: "generate", label: "Otomatik Üret", icon: Wand2 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Anahtarlar</h1>
          <p className="text-gray-500 text-sm">{keys.length} anahtar</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon && <tab.icon size={15} />}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Anahtar Listesi */}
      {activeTab === "list" && (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex gap-3">
            <select value={filterGame} onChange={(e) => setFilterGame(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white">
              <option value="">Tüm Oyunlar</option>
              {games.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
            </select>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {keys.filter(k => !k.isUsed).length} kullanılabilir
              <span className="w-2 h-2 rounded-full bg-red-400 ml-2"></span>
              {keys.filter(k => k.isUsed).length} kullanılmış
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
            ) : keys.length === 0 ? (
              <div className="text-center py-12 text-gray-400">Anahtar bulunamadı.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Anahtar</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Oyun</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Durum</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tarih</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {keys.map((k) => (
                    <tr key={k.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-mono text-xs text-gray-700">{k.key}</td>
                      <td className="px-4 py-3 text-gray-700 max-w-36 truncate">{k.game?.title}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          k.isUsed ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        }`}>
                          {k.isUsed ? "Kullanıldı" : "Hazır"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{new Date(k.createdAt).toLocaleDateString("tr-TR")}</td>
                      <td className="px-4 py-3">
                        {!k.isUsed && (
                          <button onClick={() => handleDelete(k.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Manuel Ekle */}
      {activeTab === "add" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-lg">
          <h2 className="font-bold text-gray-900 mb-4">Manuel Anahtar Ekle</h2>
          {addError && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl mb-4">{addError}</div>}
          {addSuccess && <div className="bg-green-50 text-green-700 text-sm p-3 rounded-xl mb-4">{addSuccess}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Oyun</label>
              <select value={addGameId} onChange={(e) => setAddGameId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white">
                <option value="">Oyun seçin</option>
                {games.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Anahtarlar <span className="text-gray-400 font-normal">(her satıra bir anahtar)</span>
              </label>
              <textarea
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                rows={8}
                placeholder={"XXXXX-XXXXX-XXXXX-XXXXX-XXXXX\nYYYYY-YYYYY-YYYYY-YYYYY-YYYYY"}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                {keyInput.split("\n").filter(k => k.trim()).length} anahtar girildi
              </p>
            </div>
            <button
              onClick={handleManualAdd}
              disabled={addSaving || !addGameId || !keyInput.trim()}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              {addSaving ? "Ekleniyor..." : "Anahtarları Ekle"}
            </button>
          </div>
        </div>
      )}

      {/* Otomatik Üretme */}
      {activeTab === "generate" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                <Wand2 size={16} className="text-purple-600" />
              </div>
              <h2 className="font-bold text-gray-900">Otomatik Key Üret</h2>
            </div>

            {genError && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl mb-4">{genError}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oyun</label>
                <select value={genGameId} onChange={(e) => setGenGameId(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white">
                  <option value="">Oyun seçin</option>
                  {games.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Anahtar Formatı</label>
                <div className="space-y-2">
                  {KEY_FORMATS.map((fmt) => (
                    <label key={fmt.value} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      genFormat === fmt.value ? "border-amber-300 bg-amber-50" : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <input
                        type="radio"
                        name="format"
                        value={fmt.value}
                        checked={genFormat === fmt.value}
                        onChange={(e) => setGenFormat(e.target.value)}
                        className="mt-0.5 accent-amber-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{fmt.label}</p>
                        <p className="text-xs font-mono text-gray-400 mt-0.5">{fmt.example}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {genFormat === "custom" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ön Ek (max 6 karakter)</label>
                  <input
                    value={genPrefix}
                    onChange={(e) => setGenPrefix(e.target.value.toUpperCase().slice(0, 6))}
                    placeholder="KADE"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adet (1-500)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={genCount}
                    onChange={(e) => setGenCount(e.target.value)}
                    min="1"
                    max="500"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex gap-1">
                    {[10, 25, 50, 100].map((n) => (
                      <button key={n} onClick={() => setGenCount(String(n))}
                        className={`px-2 py-2 rounded-lg text-xs border transition ${
                          genCount === String(n) ? "border-amber-400 bg-amber-50 text-amber-700" : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}>{n}</button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={genLoading || !genGameId}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Wand2 size={16} />
                {genLoading ? "Üretiliyor..." : `${genCount} Anahtar Üret`}
              </button>
            </div>
          </div>

          {/* Üretilen Anahtarlar */}
          {genResult && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-gray-900">Üretilen Anahtarlar</h2>
                  <p className="text-sm text-gray-500">{genResult.game} · {genResult.keys.length} adet</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyAllKeys}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                    {copied ? "Kopyalandı" : "Tümünü Kopyala"}
                  </button>
                  <button
                    onClick={downloadKeys}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition"
                  >
                    <Download size={13} />
                    İndir (.txt)
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 h-96 overflow-y-auto">
                <div className="space-y-1">
                  {genResult.keys.map((key, i) => (
                    <div key={i} className="flex items-center gap-2 py-1">
                      <span className="text-xs text-gray-300 w-6 text-right flex-shrink-0">{i + 1}</span>
                      <span className="font-mono text-xs text-gray-700">{key}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-green-600 bg-green-50 rounded-xl p-3">
                <Check size={14} />
                Anahtarlar veritabanına kaydedildi ve oyunla ilişkilendirildi.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
