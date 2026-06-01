"use client";
import { useState } from "react";
import Link from "next/link";
import { Gamepad2, ArrowUpRight, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 red-glow opacity-40" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#FFF785]/10 blur-[120px]" />
      <div className="absolute inset-0 grain opacity-60" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 text-white">
            <Gamepad2 size={22} className="text-[#FFF785]" />
            <span className="font-display font-black text-2xl tracking-tight">kadestore</span>
          </Link>
          <h1 className="font-display text-3xl font-black text-white">Şifremi Unuttum</h1>
          <p className="text-gray-400 text-sm mt-2">E-posta adresinize sıfırlama bağlantısı göndereceğiz.</p>
        </div>

        <div className="bg-[#111111] rounded-3xl border border-white/5 shadow-2xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                <Mail size={28} className="text-emerald-400" />
              </div>
              <h2 className="font-display text-xl font-bold text-white mb-2">E-posta Gönderildi</h2>
              <p className="text-sm text-gray-400 mb-6">
                Eğer girdiğiniz adres sistemimizde kayıtlıysa, şifre sıfırlama bağlantısı gönderildi. Gelen kutunuzu (ve spam klasörünü) kontrol edin.
              </p>
              <Link href="/login" className="inline-flex items-center gap-2 text-[#FFF785] hover:text-[#FFE74F] font-semibold">
                Giriş sayfasına dön <ArrowUpRight size={14} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">E-posta</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="ornek@email.com"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFF785]/60 transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group w-full inline-flex items-center justify-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] disabled:opacity-60 text-[#0a0a0a] py-3.5 rounded-full font-semibold text-sm transition shadow-[0_15px_40px_-10px_rgba(255,247,133,0.6)]"
              >
                {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
                {!loading && <ArrowUpRight size={14} />}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-400 mt-6">
            <Link href="/login" className="text-[#FFF785] hover:text-[#FFE74F] font-semibold">Giriş Yap</Link>
            {" · "}
            <Link href="/register" className="text-[#FFF785] hover:text-[#FFE74F] font-semibold">Kayıt Ol</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
