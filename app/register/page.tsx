"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Gamepad2, ArrowUpRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push("/login?registered=1");
    } else {
      setError(data.error || "Bir hata oluştu.");
    }
    setLoading(false);
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFF785]/60 focus:bg-white/[0.07] transition";

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 red-glow opacity-50" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#FFF785]/10 blur-[120px]" />
      <div className="absolute inset-0 grain opacity-60" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 text-white">
            <Gamepad2 size={22} className="text-[#FFF785]" />
            <span className="font-display font-black text-2xl tracking-tight">kadestore</span>
          </Link>
          <h1 className="font-display text-3xl font-black text-white">Hesap Oluştur</h1>
          <p className="text-gray-400 text-sm mt-2">Ücretsiz kayıt olun, oynamaya başlayın</p>
        </div>

        <div className="bg-[#111111] rounded-3xl border border-white/5 shadow-2xl p-8">
          {error && (
            <div className="bg-[#FFF785]/10 border border-[#FFF785]/20 text-[#FFF785] text-sm p-3 rounded-xl mb-4">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Ad Soyad</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Adınız" className={inputClass} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">E-posta</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="ornek@email.com" className={inputClass} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Şifre</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  placeholder="En az 6 karakter"
                  minLength={6}
                  className={inputClass + " pr-10"}
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
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                required
                placeholder="Şifreyi tekrar girin"
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="group w-full inline-flex items-center justify-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] disabled:opacity-60 text-[#0a0a0a] py-3.5 rounded-full font-semibold text-sm transition shadow-[0_15px_40px_-10px_rgba(255,247,133,0.6)]"
            >
              {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
              {!loading && (
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition">
                  <ArrowUpRight size={12} />
                </span>
              )}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-6">
            Zaten hesabınız var mı?{" "}
            <Link href="/login" className="text-[#FFF785] hover:text-[#FFF785] font-semibold">Giriş Yap</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
