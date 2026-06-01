"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Gamepad2, CheckCircle, XCircle, Loader2 } from "lucide-react";

function VerifyContent() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [status, setStatus] = useState<"loading" | "ok" | "fail">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("fail");
      return;
    }
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((r) => (r.ok ? setStatus("ok") : setStatus("fail")))
      .catch(() => setStatus("fail"));
  }, [token]);

  if (status === "loading") {
    return (
      <div className="text-center">
        <Loader2 size={48} className="text-[#FFF785] mx-auto mb-3 animate-spin" />
        <p className="text-gray-400">Doğrulanıyor...</p>
      </div>
    );
  }

  if (status === "ok") {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={28} className="text-emerald-400" />
        </div>
        <h2 className="font-display text-2xl font-bold text-white mb-2">E-Posta Doğrulandı</h2>
        <p className="text-sm text-gray-400 mb-6">Artık hesabınıza giriş yapabilirsiniz.</p>
        <Link href="/login" className="inline-flex items-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] px-6 py-3 rounded-full font-semibold text-sm">
          Giriş Yap
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
        <XCircle size={28} className="text-red-400" />
      </div>
      <h2 className="font-display text-2xl font-bold text-white mb-2">Doğrulama Başarısız</h2>
      <p className="text-sm text-gray-400 mb-6">
        Bağlantı geçersiz ya da süresi dolmuş olabilir. Yeniden kayıt deneyin.
      </p>
      <Link href="/register" className="inline-flex items-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] px-6 py-3 rounded-full font-semibold text-sm">
        Kayıt Sayfasına Dön
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
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
        </div>

        <div className="bg-[#111111] rounded-3xl border border-white/5 shadow-2xl p-8">
          <Suspense fallback={<div className="text-center text-gray-400">Yükleniyor...</div>}>
            <VerifyContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
