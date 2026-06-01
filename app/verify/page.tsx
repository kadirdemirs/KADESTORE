"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, CheckCircle, XCircle } from "lucide-react";

export default function VerifyPage() {
  const [key, setKey] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const res = await fetch(`/api/keys/verify?key=${encodeURIComponent(key)}`);
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-[#0a0a0a] py-16 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white">Anahtar Doğrulama</h1>
            <p className="text-gray-500 mt-2 text-sm">
              Satın aldığınız oyun anahtarını doğrulamak için aşağıya girin.
            </p>
          </div>

          <div className="bg-[#111111] rounded-2xl border border-white/5 shadow-2xl p-8">
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1.5">Oyun Anahtarı</label>
                <input
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  required
                  placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
                  className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#FFF785] transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !key.trim()}
                className="w-full bg-[#FFF785] hover:bg-[#FFF785] disabled:opacity-60 text-[#0a0a0a] py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2"
              >
                <Search size={16} />
                {loading ? "Doğrulanıyor..." : "Doğrula"}
              </button>
            </form>

            {result && (
              <div className={`mt-6 p-4 rounded-xl border ${result.valid ? "bg-green-50 border-green-200" : "bg-[#FFF785]/10 border-red-200"}`}>
                <div className="flex items-center gap-2 mb-2">
                  {result.valid ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : (
                    <XCircle size={20} className="text-[#FFF785]" />
                  )}
                  <p className={`font-semibold ${result.valid ? "text-green-700" : "text-[#FFE74F]"}`}>
                    {result.valid ? "Geçerli Anahtar" : "Geçersiz Anahtar"}
                  </p>
                </div>
                {result.valid && result.game && (
                  <div className="text-sm text-green-700 space-y-1">
                    <p>Oyun: <strong>{result.game}</strong></p>
                    <p>Platform: <strong>{result.platform}</strong></p>
                    <p>Durum: <strong>{result.used ? "Kullanılmış" : "Kullanılmamış"}</strong></p>
                  </div>
                )}
                {!result.valid && (
                  <p className="text-sm text-[#FFF785]">{result.error || "Bu anahtar bulunamadı."}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
