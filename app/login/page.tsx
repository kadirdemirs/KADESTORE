"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Gamepad2, ArrowUpRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) {
      router.push("/");
    } else {
      setError("E-posta veya şifre hatalı.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 red-glow opacity-50" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#FFF785]/10 blur-[120px]" />
      <div className="absolute inset-0 grain opacity-60" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 text-white">
            <Gamepad2 size={22} className="text-[#FFF785]" />
            <span className="font-display font-black text-2xl tracking-tight">kadestore</span>
          </Link>
          <h1 className="font-display text-3xl font-black text-white">Hoş geldiniz</h1>
          <p className="text-gray-400 text-sm mt-2">Hesabınıza giriş yapın</p>
        </div>

        <div className="bg-[#111111] rounded-3xl border border-white/5 shadow-2xl p-8">
          {error && (
            <div className="bg-[#FFF785]/10 border border-[#FFF785]/20 text-[#FFF785] text-sm p-3 rounded-xl mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ornek@email.com"
                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFF785]/60 focus:bg-white/[0.07] transition"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Şifre</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[#FFF785]/60 focus:bg-white/[0.07] transition"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="group w-full inline-flex items-center justify-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] disabled:opacity-60 text-[#0a0a0a] py-3.5 rounded-full font-semibold text-sm transition shadow-[0_15px_40px_-10px_rgba(255,247,133,0.6)]"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              {!loading && (
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition">
                  <ArrowUpRight size={12} />
                </span>
              )}
            </button>
          </form>

          <div className="flex items-center justify-between mt-6 text-sm">
            <Link href="/forgot-password" className="text-gray-400 hover:text-[#FFF785]">Şifremi unuttum</Link>
            <Link href="/register" className="text-[#FFF785] hover:text-[#FFE74F] font-semibold">Kayıt Ol</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
