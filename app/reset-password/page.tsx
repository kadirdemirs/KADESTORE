"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Gamepad2, ArrowUpRight, Eye, EyeOff, CheckCircle } from "lucide-react";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } else {
      setError(data.error || "Hata oluştu.");
    }
    setLoading(false);
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-gray-400">Geçersiz bağlantı.</p>
        <Link href="/forgot-password" className="text-[#FFF785] mt-3 inline-block">Yeni bağlantı iste</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <CheckCircle size={48} className="text-emerald-400 mx-auto mb-3" />
        <h2 className="font-display text-xl font-bold text-white mb-2">Şifreniz Sıfırlandı</h2>
        <p className="text-sm text-gray-400">Giriş sayfasına yönlendiriliyorsunuz...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl">{error}</div>
      )}
      <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Yeni Şifre</label>
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="En az 8 karakter (A-z, 0-9)"
            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[#FFF785]/60 transition"
          />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition">
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Şifre Tekrar</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          placeholder="Şifreyi tekrar girin"
          className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFF785]/60 transition"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="group w-full inline-flex items-center justify-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] disabled:opacity-60 text-[#0a0a0a] py-3.5 rounded-full font-semibold text-sm transition"
      >
        {loading ? "Sıfırlanıyor..." : "Şifreyi Sıfırla"}
        {!loading && <ArrowUpRight size={14} />}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
          <h1 className="font-display text-3xl font-black text-white">Yeni Şifre Belirle</h1>
        </div>

        <div className="bg-[#111111] rounded-3xl border border-white/5 shadow-2xl p-8">
          <Suspense fallback={<div className="text-center text-gray-400">Yükleniyor...</div>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
