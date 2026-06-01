"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Key, CheckCircle, Gamepad2, Trophy, ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/Skeleton";

export default function RedeemPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [keyInput, setKeyInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?redirect=/redeem");
  }, [status]);

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const res = await fetch("/api/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: keyInput }),
    });
    const data = await res.json();

    if (res.ok) {
      setResult(data);
      setKeyInput("");
    } else {
      setError(data.error || "Bir hata oluştu.");
    }
    setLoading(false);
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-100">
        <Header />
        <main className="flex-1 pt-32 pb-16 px-4">
          <div className="max-w-xl mx-auto space-y-4">
            <Skeleton className="h-16 w-16 mx-auto rounded-2xl" />
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-4 w-80 mx-auto" />
            <Skeleton className="h-44 w-full rounded-3xl mt-6" />
            <Skeleton className="h-32 w-full rounded-3xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-100">
      <Header />
      <main className="flex-1 pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 red-glow opacity-40" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#FFF785]/10 blur-[100px]" />

        <div className="relative max-w-xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF785]/15 border border-[#FFF785]/20 flex items-center justify-center mx-auto mb-5">
              <Key size={28} className="text-[#FFF785]" />
            </div>
            <span className="inline-block bg-[#FFF785]/10 text-[#FFF785] text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-[#FFF785]/20">
              Aktivasyon
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight">Oyun Kodu Gir</h1>
            <p className="text-gray-400 mt-3 text-sm">
              Aldığınız veya satın aldığınız oyun kodunu kütüphanenize ekleyin.
            </p>
          </div>

          <div className="bg-[#111111] rounded-3xl border border-white/5 shadow-2xl p-6 mb-4">
            <form onSubmit={handleRedeem} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Oyun Anahtarı</label>
                <input
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value.toUpperCase())}
                  placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-600 rounded-xl px-4 py-3.5 text-sm font-mono tracking-wider focus:outline-none focus:border-[#FFF785]/60 focus:bg-white/[0.07] transition text-center"
                  spellCheck={false}
                  autoComplete="off"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Satın alma işleminizden gelen kodu buraya girin
                </p>
              </div>

              {error && (
                <div className="bg-[#FFF785]/10 border border-[#FFF785]/20 text-[#FFF785] text-sm p-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !keyInput.trim()}
                className="group w-full inline-flex items-center justify-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] disabled:opacity-50 text-[#0a0a0a] py-3.5 rounded-full font-semibold text-sm transition shadow-[0_15px_40px_-10px_rgba(255,247,133,0.6)]"
              >
                <Key size={16} />
                {loading ? "Kontrol ediliyor..." : "Kodu Etkinleştir"}
              </button>
            </form>
          </div>

          {result && (
            <div className="bg-[#111111] rounded-3xl border border-green-500/20 shadow-2xl overflow-hidden animate-fadeIn">
              <div className="bg-green-600 px-5 py-3 flex items-center gap-2">
                <CheckCircle size={18} className="text-white" />
                <span className="text-white font-semibold text-sm">Aktivasyon Başarılı!</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFF785] to-[#FFE74F] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {result.game.imageUrl ? (
                      <img src={result.game.imageUrl} alt={result.game.title} className="w-full h-full object-cover" />
                    ) : (
                      <Gamepad2 size={28} className="text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">{result.game.title}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-full uppercase tracking-wider">{result.game.platform}</span>
                      <span className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-full uppercase tracking-wider">{result.game.genre}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-4">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Aktif edilen anahtar</p>
                  <p className="font-mono text-sm text-white font-bold tracking-wider">{result.key}</p>
                </div>

                {result.rank && result.rank !== "none" && (
                  <div className="flex items-center gap-2 bg-[#FFF785]/10 border border-[#FFF785]/20 rounded-xl p-3 mb-4">
                    <Trophy size={16} className="text-[#FFF785]" />
                    <p className="text-sm text-[#FFF785]">
                      Tebrikler! Yeni rank: <strong>KadeStore | {result.rank}</strong>
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => { setResult(null); setKeyInput(""); }}
                    className="flex-1 border border-white/10 text-gray-200 py-2.5 rounded-full text-sm hover:bg-white/5 transition"
                  >
                    Başka Kod Gir
                  </button>
                  <Link
                    href="/profile"
                    className="flex-1 bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] py-2.5 rounded-full text-sm font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    Kütüphaneye Git <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {!result && (
            <div className="bg-[#111111] rounded-3xl border border-white/5 p-6 text-sm text-gray-400 space-y-3">
              <p className="font-display text-base font-bold text-white mb-3">Nasıl kullanılır?</p>
              {[
                "Satın aldığınız oyunun anahtarı profil sayfanızda veya e-postanızda bulunur.",
                "Anahtarı yukarıdaki kutuya girin ve 'Kodu Etkinleştir' butonuna basın.",
                "Aktivasyon sonrası oyun kütüphanenize eklenir.",
                "Her anahtar yalnızca bir kez kullanılabilir.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FFF785]/15 text-[#FFF785] text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5 border border-[#FFF785]/20">{i + 1}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
