"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Clock, RefreshCw, Copy, Check, ShieldCheck } from "lucide-react";
import type { LibraryItem } from "@/components/AccountCard";
import { Skeleton } from "@/components/Skeleton";

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
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-100">
      <Header />
      <main className="flex-1 pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 red-glow opacity-30" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#FFF785]/10 blur-[100px]" />

        <div className="relative max-w-xl mx-auto">
          <span className="inline-block bg-[#FFF785]/10 text-[#FFF785] text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-[#FFF785]/20">
            <Shield size={12} className="inline -mt-0.5 mr-1" /> Guard Sistemi
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight">Doğrulama Kodu</h1>
          <p className="text-gray-400 mt-3 mb-6">
            Oyun hesabına giriş için gerekli tek kullanımlık guard kodunu buradan oluşturabilirsiniz.
          </p>

          <div className="bg-[#FFF785]/10 border border-[#FFF785]/20 rounded-xl p-3 mb-6 flex items-center gap-2 text-sm text-[#FFF785]">
            <Clock size={16} /> Kodlar <strong>30 saniye</strong> geçerlidir. Aldıktan sonra hemen kullanın.
          </div>

          {status === "loading" || loading ? (
            <div className="bg-[#111111] rounded-3xl border border-white/5 shadow-2xl p-6 space-y-5">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-12 flex-1 rounded-full" />
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </div>
          ) : !session ? (
            <div className="bg-[#111111] rounded-3xl border border-white/5 shadow-2xl p-8 text-center">
              <Shield size={32} className="text-white/20 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-4">Kod oluşturmak için giriş yapmalısınız.</p>
              <Link href="/login?redirect=/guard" className="inline-flex items-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] px-5 py-2.5 rounded-full text-sm font-semibold transition">
                Giriş Yap
              </Link>
            </div>
          ) : accounts.length === 0 ? (
            <div className="bg-[#111111] rounded-3xl border border-white/5 shadow-2xl p-8 text-center">
              <Shield size={32} className="text-white/20 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-4">Guard kodu üretilebilecek bir hesabınız yok.</p>
              <Link href="/games" className="inline-flex items-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] px-5 py-2.5 rounded-full text-sm font-semibold transition">
                Oyunlara Göz At
              </Link>
            </div>
          ) : (
            <div className="bg-[#111111] rounded-3xl border border-white/5 shadow-2xl p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Oyun</label>
                <select
                  value={selected}
                  onChange={(e) => { setSelected(e.target.value); setResult(null); }}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-[#FFF785]/60"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.gameKey.game.title} — {a.gameKey.game.platform}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Doğrulama</label>
                <button
                  type="button"
                  onClick={() => setVerified((v) => !v)}
                  className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                    verified
                      ? "border-[#FFF785]/40 bg-[#FFF785]/10 text-[#FFF785]"
                      : "border-white/10 bg-white/5 text-gray-300 hover:border-white/20"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center ${verified ? "bg-[#FFF785]" : "border-2 border-white/20"}`}>
                    {verified && <Check size={13} className="text-white" />}
                  </span>
                  {verified ? "Doğrulama tamamlandı" : "İnsan olduğumu doğruluyorum"}
                  <ShieldCheck size={16} className="ml-auto text-gray-500" />
                </button>
              </div>

              {result && (
                <div className="bg-[#FFF785]/10 border border-[#FFF785]/20 rounded-xl p-4">
                  <p className="text-xs text-[#FFF785] mb-2 uppercase tracking-wider">{result.label}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-3xl font-black tracking-[0.3em] text-[#FFF785] select-all">
                      {result.code}
                    </p>
                    <button onClick={copyCode} className="p-2.5 rounded-lg bg-[#FFF785]/15 hover:bg-[#FFF785]/25 transition">
                      {copied ? <Check size={18} className="text-[#FFF785]" /> : <Copy size={18} className="text-[#FFF785]" />}
                    </button>
                  </div>
                </div>
              )}
              {error && <p className="text-[#FFF785] text-sm">{error}</p>}

              <div className="flex gap-2">
                <button
                  onClick={generate}
                  disabled={!verified || genLoading}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] py-3.5 rounded-full text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_15px_40px_-10px_rgba(255,247,133,0.6)]"
                >
                  <Shield size={16} /> {genLoading ? "Üretiliyor..." : "Guard Kodu Al"}
                </button>
                <button
                  onClick={generate}
                  disabled={!verified || genLoading || !result}
                  title="Yenile"
                  className="px-4 rounded-full border border-white/10 text-gray-300 hover:bg-white/5 transition disabled:opacity-40"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 bg-[#111111] rounded-3xl border border-white/5 p-6">
            <h2 className="font-display font-bold text-white mb-4">KadeStore Guard nedir?</h2>
            <div className="space-y-3">
              {[
                "Tüm hesaplar teslim öncesi doğrulanır",
                "Geçersiz ürün durumunda tam iade garantisi",
                "Guard kodları yalnızca size özel ve tek kullanımlıktır",
                "256-bit SSL şifreleme ile güvenli erişim",
              ].map((t) => (
                <div key={t} className="flex items-center gap-3">
                  <Check size={14} className="text-[#FFF785] flex-shrink-0" />
                  <p className="text-sm text-gray-300">{t}</p>
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
