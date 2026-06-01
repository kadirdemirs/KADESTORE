import Link from "next/link";
import { Gamepad2, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 text-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 red-glow opacity-30" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#FFF785]/10 blur-[120px]" />
      <div className="absolute inset-0 grain opacity-60" />

      <div className="relative max-w-md text-center">
        <p className="font-display text-[12rem] font-black text-[#FFF785] leading-none tracking-tighter">
          404
        </p>
        <h1 className="font-display text-3xl font-black text-white mb-2">Sayfa Bulunamadı</h1>
        <p className="text-gray-400 mb-8 text-sm">
          Aradığınız sayfa mevcut değil, taşınmış olabilir ya da hiç var olmamış olabilir.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] px-5 py-2.5 rounded-full text-sm font-semibold transition"
          >
            <Home size={14} /> Ana Sayfa
          </Link>
          <Link
            href="/games"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition"
          >
            <Search size={14} /> Oyunlara Bak
          </Link>
        </div>
      </div>
    </div>
  );
}
