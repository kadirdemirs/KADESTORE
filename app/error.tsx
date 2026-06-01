"use client";
import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Production'da Sentry'e gönder
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 text-gray-100">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={28} className="text-red-400" />
        </div>
        <h1 className="font-display text-4xl font-black text-white mb-2">Bir Şey Ters Gitti</h1>
        <p className="text-gray-400 mb-6 text-sm">
          Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.
          {error.digest && (
            <span className="block mt-2 text-[10px] font-mono text-gray-600">
              Hata kodu: {error.digest}
            </span>
          )}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] px-5 py-2.5 rounded-full text-sm font-semibold transition"
          >
            <RefreshCw size={14} /> Tekrar Dene
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition"
          >
            <Home size={14} /> Ana Sayfa
          </Link>
        </div>
      </div>
    </div>
  );
}
