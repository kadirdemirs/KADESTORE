"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Key, CheckCircle, Gamepad2, Trophy, ArrowRight } from "lucide-react";

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
      <main className="flex-1 bg-gray-50 py-14 px-4">
        <div className="max-w-xl mx-auto">
          {/* Başlık */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Key size={30} className="text-amber-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Oyun Kodu Gir</h1>
            <p className="text-gray-500 mt-2 text-sm">
              Aldığınız veya satın aldığınız oyun kodunu girerek kütüphanenize ekleyin.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
            <form onSubmit={handleRedeem} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Oyun Anahtarı</label>
                <input
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value.toUpperCase())}
                  placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono tracking-wider focus:outline-none focus:border-amber-400 transition text-center"
                  spellCheck={false}
                  autoComplete="off"
                  disabled={loading}
                />
                <p className="text-xs text-gray-400 mt-1.5 text-center">
                  Satın alma işleminizden gelen kodu buraya girin
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 text-sm p-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !keyInput.trim()}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2"
              >
                <Key size={16} />
                {loading ? "Kontrol ediliyor..." : "Kodu Etkinleştir"}
              </button>
            </form>
          </div>

          {/* Başarı */}
          {result && (
            <div className="bg-white rounded-2xl border border-green-200 shadow-sm overflow-hidden animate-fadeIn">
              <div className="bg-green-500 px-5 py-3 flex items-center gap-2">
                <CheckCircle size={18} className="text-white" />
                <span className="text-white font-semibold text-sm">Aktivasyon Başarılı!</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {result.game.imageUrl ? (
                      <img src={result.game.imageUrl} alt={result.game.title} className="w-full h-full object-cover" />
                    ) : (
                      <Gamepad2 size={28} className="text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{result.game.title}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{result.game.platform}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{result.game.genre}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Aktif edilen anahtar</p>
                  <p className="font-mono text-sm text-gray-700 font-bold tracking-wider">{result.key}</p>
                </div>

                {result.rank && result.rank !== "none" && (
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4">
                    <Trophy size={16} className="text-amber-500" />
                    <p className="text-sm text-amber-800">
                      Tebrikler! Yeni rank: <strong>KadeStore | {result.rank}</strong>
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => { setResult(null); setKeyInput(""); }}
                    className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-xl text-sm hover:bg-gray-50 transition"
                  >
                    Başka Kod Gir
                  </button>
                  <Link
                    href="/profile"
                    className="flex-1 bg-gray-900 text-white py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition flex items-center justify-center gap-1.5"
                  >
                    Kütüphaneye Git <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Bilgi kutusu */}
          {!result && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 text-sm text-gray-600 space-y-2">
              <p className="font-semibold text-gray-900 mb-3">Nasıl kullanılır?</p>
              {[
                "Satın aldığınız oyunun anahtarı profil sayfanızda veya e-postanızda bulunur.",
                "Anahtarı yukarıdaki kutuya girin ve 'Kodu Etkinleştir' butonuna basın.",
                "Aktivasyon sonrası oyun kütüphanenize eklenir.",
                "Her anahtar yalnızca bir kez kullanılabilir.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5">{i + 1}</span>
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
