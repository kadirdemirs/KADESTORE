"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Clock, RefreshCw, Copy, Check, ShieldCheck } from "lucide-react";
import type { LibraryItem } from "@/components/AccountCard";

export default function GuardPage() {
  const { data: session, status } = useSession();
  const [accounts, setAccounts] = useState<LibraryItem[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [genLoading, setGenLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ code: string; secsLeft: number; label: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      if (status === "unauthenticated") setLoading(false);
      return;
    }
    fetch("/api/profile/library")
      .then((r) => r.json())
      .then((data) => {
        const accs = (data.library || []).filter(
          (i: LibraryItem) => i.deliveryType === "account" && i.gameKey.hasGuard
        );
        setAccounts(accs);
        if (accs.length) setSelected(accs[0].id);
        setLoading(false);
      });
  }, [status]);

  async function generate() {
    if (!selected || !verified) return;
    setGenLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/guard-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userKeyId: selected }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Kod alınamadı.");
      else setResult(data);
    } catch {
      setError("Bağlantı hatası.");
    }
    setGenLoading(false);
  }

  function copyCode() {
    if (!result) return;
    navigator.clipboard.writeText(result.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-950 py-12 px-4">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-wider mb-2">
            <Shield size={15} /> GUARD SİSTEMİ
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Doğrulama Kodu</h1>
          <p className="text-gray-500 mt-2 mb-6">
            Oyun hesabına giriş için gerekli tek kullanımlık guard kodunu buradan oluşturabilirsiniz.
          </p>

          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl p-3 mb-6 flex items-center gap-2 text-sm text-amber-800 dark:text-amber-300">
            <Clock size={16} /> Kodlar <strong>30 saniye</strong> geçerlidir. Aldıktan sonra hemen kullanın.
          </div>

          {status === "loading" || loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !session ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 text-center">
              <Shield size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-4">Kod oluşturmak için giriş yapmalısınız.</p>
              <Link href="/login?redirect=/guard" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition">
                Giriş Yap
              </Link>
            </div>
          ) : accounts.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 text-center">
              <Shield size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-4">Guard kodu üretilebilecek bir hesabınız yok.</p>
              <Link href="/games" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition">
                Oyunlara Göz At
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-5">
              {/* Oyun seçimi */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Oyun</label>
                <select
                  value={selected}
                  onChange={(e) => { setSelected(e.target.value); setResult(null); }}
                  className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-green-400"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.gameKey.game.title} — {a.gameKey.game.platform}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doğrulama (basit onay) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Doğrulama</label>
                <button
                  type="button"
                  onClick={() => setVerified((v) => !v)}
                  className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                    verified
                      ? "border-green-300 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-300"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center ${verified ? "bg-green-500" : "border-2 border-gray-300"}`}>
                    {verified && <Check size={13} className="text-white" />}
                  </span>
                  {verified ? "Doğrulama tamamlandı" : "İnsan olduğumu doğruluyorum"}
                  <ShieldCheck size={16} className="ml-auto text-gray-300" />
                </button>
              </div>

              {/* Sonuç */}
              {result && (
                <div className="bg-green-50 dark:bg-green-500/10 rounded-xl p-4">
                  <p className="text-xs text-green-700 dark:text-green-300 mb-1">{result.label}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-3xl font-black tracking-[0.3em] text-green-700 dark:text-green-300 select-all">
                      {result.code}
                    </p>
                    <button onClick={copyCode} className="p-2 rounded-lg bg-green-100 dark:bg-green-500/20 hover:bg-green-200 transition">
                      {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} className="text-green-600" />}
                    </button>
                  </div>
                </div>
              )}
              {error && <p className="text-red-600 text-sm">{error}</p>}

              {/* Butonlar */}
              <div className="flex gap-2">
                <button
                  onClick={generate}
                  disabled={!verified || genLoading}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Shield size={16} /> {genLoading ? "Üretiliyor..." : "Guard Kodu Al"}
                </button>
                <button
                  onClick={generate}
                  disabled={!verified || genLoading || !result}
                  title="Yenile"
                  className="px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-40"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Bilgilendirme */}
          <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">KadeStore Guard nedir?</h2>
            <div className="space-y-2">
              {[
                "Tüm hesaplar teslim öncesi doğrulanır",
                "Geçersiz ürün durumunda tam iade garantisi",
                "Guard kodları yalnızca size özel ve tek kullanımlıktır",
                "256-bit SSL şifreleme ile güvenli erişim",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2.5">
                  <Check size={15} className="text-green-500 flex-shrink-0" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
