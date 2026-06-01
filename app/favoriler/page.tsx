"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameCard from "@/components/GameCard";
import Link from "next/link";
import { Heart, ArrowUpRight } from "lucide-react";

export default function FavorilerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?redirect=/favoriler");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-100">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 red-glow opacity-30" />

        <div className="relative max-w-7xl mx-auto">
          <span className="inline-block bg-[#FFF785]/10 text-[#FFF785] text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-[#FFF785]/20">
            <Heart size={12} className="inline -mt-0.5 mr-1" /> Favoriler
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Favorilerim
          </h1>
          <p className="text-gray-400 mb-8">{items.length} oyun favoride</p>

          {loading ? (
            <p className="text-gray-500">Yükleniyor...</p>
          ) : items.length === 0 ? (
            <div className="bg-[#111111] border border-white/5 rounded-3xl p-14 text-center">
              <Heart size={40} className="text-white/10 mx-auto mb-4" />
              <p className="text-gray-300 text-base font-semibold mb-1">Favoriniz yok.</p>
              <p className="text-gray-500 text-sm mb-5">Beğendiğiniz oyunları favorilere ekleyin.</p>
              <Link
                href="/games"
                className="inline-flex items-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] px-5 py-2.5 rounded-full text-sm font-semibold transition"
              >
                Oyunlara Bak <ArrowUpRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {items.map((w) => (
                <GameCard key={w.id} game={w.game} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
