import { WifiOff } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 text-gray-100">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
          <WifiOff size={28} className="text-gray-500" />
        </div>
        <h1 className="font-display text-3xl font-black text-white mb-2">Çevrimdışısınız</h1>
        <p className="text-gray-400 mb-6 text-sm">
          İnternet bağlantınızı kontrol edip yeniden deneyin.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] px-5 py-2.5 rounded-full text-sm font-semibold transition"
        >
          Tekrar Dene
        </Link>
      </div>
    </div>
  );
}
