"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Plus, Trash2, Copy, Check, X, Eye, EyeOff, RefreshCw, AlertTriangle } from "lucide-react";

// Steam Guard kodu istemci tarafında üretilir (güvenlik için)
async function computeSteamCode(sharedSecret: string): Promise<string> {
  const STEAM_CHARS = "23456789BCDFGHJKMNPQRTVWXY";
  try {
    const keyData = Uint8Array.from(atob(sharedSecret.trim()), c => c.charCodeAt(0));
    const time = Math.floor(Date.now() / 1000);
    const counter = Math.floor(time / 30);
    const buf = new ArrayBuffer(8);
    const view = new DataView(buf);
    view.setUint32(0, Math.floor(counter / 0x100000000), false);
    view.setUint32(4, counter >>> 0, false);

    const cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", cryptoKey, buf);
    const hmac = new Uint8Array(sig);

    const offset = hmac[19] & 0xf;
    const code32 =
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff);

    let result = "";
    let rem = code32;
    for (let i = 0; i < 5; i++) {
      result += STEAM_CHARS[rem % STEAM_CHARS.length];
      rem = Math.floor(rem / STEAM_CHARS.length);
    }
    return result;
  } catch {
    return "HATA!";
  }
}

function getSecsLeft() {
  return 30 - (Math.floor(Date.now() / 1000) % 30);
}

interface Account {
  id: string;
  label: string;
  sharedSecret: string;
  identitySecret?: string;
}

interface LiveCode {
  code: string;
  secsLeft: number;
}

export default function SteamGuardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [liveCodes, setLiveCodes] = useState<Record<string, LiveCode>>({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "", sharedSecret: "", identitySecret: "" });
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Tek seferlik kod üretme (kaydedilmeden)
  const [quickSecret, setQuickSecret] = useState("");
  const [quickCode, setQuickCode] = useState("");
  const [quickLoading, setQuickLoading] = useState(false);
  const [quickError, setQuickError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?redirect=/steam-guard");
  }, [status]);

  async function loadAccounts() {
    const res = await fetch("/api/steam-guard");
    const data = await res.json();
    setAccounts(data.accounts || []);
    setLoading(false);
  }

  useEffect(() => {
    if (status === "authenticated") loadAccounts();
  }, [status]);

  // Tüm hesaplar için kodları güncelle
  const refreshCodes = useCallback(async () => {
    const updates: Record<string, LiveCode> = {};
    for (const acc of accounts) {
      const code = await computeSteamCode(acc.sharedSecret);
      updates[acc.id] = { code, secsLeft: getSecsLeft() };
    }
    setLiveCodes(updates);
  }, [accounts]);

  useEffect(() => {
    if (accounts.length === 0) return;
    refreshCodes();
    const iv = setInterval(refreshCodes, 1000);
    return () => clearInterval(iv);
  }, [refreshCodes]);

  async function handleAdd() {
    setSaving(true); setFormError("");
    if (!form.label.trim() || !form.sharedSecret.trim()) {
      setFormError("Hesap adı ve Shared Secret zorunludur.");
      setSaving(false); return;
    }
    // Geçerliliği test et
    const testCode = await computeSteamCode(form.sharedSecret);
    if (testCode === "HATA!") {
      setFormError("Geçersiz Shared Secret formatı. Base64 formatında olmalıdır.");
      setSaving(false); return;
    }
    const res = await fetch("/api/steam-guard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setFormError(data.error || "Hata"); setSaving(false); return; }
    setForm({ label: "", sharedSecret: "", identitySecret: "" });
    setShowForm(false);
    loadAccounts();
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu hesabı silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/steam-guard/${id}`, { method: "DELETE" });
    setAccounts(a => a.filter(x => x.id !== id));
  }

  function copyCode(id: string, code: string) {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleQuickCode() {
    setQuickLoading(true); setQuickError(""); setQuickCode("");
    const code = await computeSteamCode(quickSecret);
    if (code === "HATA!") {
      setQuickError("Geçersiz Shared Secret. Lütfen kontrol edin.");
    } else {
      setQuickCode(code);
    }
    setQuickLoading(false);
  }

  function getProgressColor(secs: number) {
    if (secs > 15) return "bg-green-500";
    if (secs > 8) return "bg-amber-500";
    return "bg-red-500";
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Başlık */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Shield size={22} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Steam Guard</h1>
                <p className="text-gray-500 text-sm">2FA kodu üreticisi</p>
              </div>
            </div>
            <button
              onClick={() => { setShowForm(true); setFormError(""); }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              <Plus size={15} /> Hesap Ekle
            </button>
          </div>

          {/* Güvenlik uyarısı */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex gap-3">
            <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <strong>Güvenlik Uyarısı:</strong> Shared Secret değerleriniz şifreli olarak saklanır. Bu bilgileri kimseyle paylaşmayın. Hesap güvenliğini artırmak için yalnızca kendi hesaplarınızı ekleyin.
            </div>
          </div>

          {/* Hesap Ekle Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl w-full max-w-md">
                <div className="flex items-center justify-between p-5 border-b">
                  <h2 className="font-bold text-gray-900">Steam Hesabı Ekle</h2>
                  <button onClick={() => setShowForm(false)}><X size={20} className="text-gray-400" /></button>
                </div>
                <div className="p-5 space-y-4">
                  {formError && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl">{formError}</div>}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hesap Adı (etiket)</label>
                    <input
                      value={form.label}
                      onChange={e => setForm({ ...form, label: e.target.value })}
                      placeholder="Örn: Ana Hesabım"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shared Secret <span className="text-gray-400 font-normal">(maFile'dan alınır)</span>
                    </label>
                    <div className="relative">
                      <input
                        value={form.sharedSecret}
                        onChange={e => setForm({ ...form, sharedSecret: e.target.value })}
                        type={showSecret["add"] ? "text" : "password"}
                        placeholder="Base64 formatında..."
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-10 text-sm font-mono focus:outline-none focus:border-blue-400"
                      />
                      <button type="button" onClick={() => setShowSecret(s => ({ ...s, add: !s.add }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showSecret["add"] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Identity Secret <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
                    </label>
                    <input
                      value={form.identitySecret}
                      onChange={e => setForm({ ...form, identitySecret: e.target.value })}
                      type="password"
                      placeholder="İsteğe bağlı..."
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
                    Shared Secret, Steam Desktop Authenticator veya SDA'nın <code className="bg-blue-100 px-1 rounded">.maFile</code> dosyasından bulunabilir.
                  </div>
                </div>
                <div className="flex gap-3 p-5 border-t">
                  <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition">İptal</button>
                  <button onClick={handleAdd} disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-60">
                    {saving ? "Kaydediliyor..." : "Kaydet"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Hesaplar */}
          {accounts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center mb-6">
              <Shield size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Henüz Steam hesabı eklenmedi.</p>
              <button onClick={() => setShowForm(true)} className="mt-3 text-blue-600 hover:underline text-sm font-medium">
                İlk hesabı ekle →
              </button>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {accounts.map(acc => {
                const live = liveCodes[acc.id];
                const secs = live?.secsLeft ?? 30;
                const pct = (secs / 30) * 100;

                return (
                  <div key={acc.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Shield size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{acc.label}</p>
                          <p className="text-xs text-gray-400">Steam Guard · Yenileniyor</p>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(acc.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Kod alanı */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-center">
                        <p className="font-mono text-3xl font-black tracking-[0.3em] text-gray-900 select-all">
                          {live?.code ?? "•••••"}
                        </p>
                      </div>
                      <button
                        onClick={() => live && copyCode(acc.id, live.code)}
                        className="w-12 h-12 rounded-xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition"
                      >
                        {copied === acc.id
                          ? <Check size={18} className="text-green-500" />
                          : <Copy size={18} className="text-blue-500" />}
                      </button>
                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(secs)}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 font-mono w-8 text-right">{secs}s</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Hızlı kod üretici (hesap kaydetmeden) */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
              <RefreshCw size={16} className="text-gray-400" />
              Hızlı Kod Üret
            </h2>
            <p className="text-xs text-gray-400 mb-4">Hesabı kaydetmeden, shared_secret girerek anlık kod alın.</p>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  value={quickSecret}
                  onChange={e => setQuickSecret(e.target.value)}
                  type={showSecret["quick"] ? "text" : "password"}
                  placeholder="Shared Secret girin..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-10 text-sm font-mono focus:outline-none focus:border-blue-400"
                />
                <button type="button" onClick={() => setShowSecret(s => ({ ...s, quick: !s.quick }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showSecret["quick"] ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <button
                onClick={handleQuickCode}
                disabled={quickLoading || !quickSecret.trim()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition disabled:opacity-60"
              >
                {quickLoading ? "..." : "Üret"}
              </button>
            </div>
            {quickError && <p className="text-red-600 text-xs mt-2">{quickError}</p>}
            {quickCode && (
              <div className="mt-3 bg-blue-50 rounded-xl p-3 flex items-center justify-between">
                <p className="font-mono text-xl font-black tracking-[0.25em] text-blue-800">{quickCode}</p>
                <button onClick={() => { navigator.clipboard.writeText(quickCode); }} className="text-xs text-blue-600 hover:underline">Kopyala</button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
