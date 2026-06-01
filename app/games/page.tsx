import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Gamepad2, Search } from "lucide-react";
import GameCard from "@/components/GameCard";

export const metadata: Metadata = {
  title: "Oyunlar",
  description: "KadeStore'da 500+ dijital oyun keşfedin. Steam, Epic Games, Xbox ve daha fazlası.",
};

export const dynamic = "force-dynamic";

async function getGames(platform?: string, genre?: string, q?: string, sort?: string, minPrice?: string, maxPrice?: string) {
  return prisma.game.findMany({
    where: {
      isActive: true,
      ...(platform && { platform }),
      ...(genre && { genre }),
      ...(q && { title: { contains: q } }),
      ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
    },
    include: { _count: { select: { keys: { where: { isUsed: false } } } } },
    orderBy: sort === "price_asc" ? { price: "asc" }
      : sort === "price_desc" ? { price: "desc" }
      : sort === "title" ? { title: "asc" }
      : { createdAt: "desc" },
  });
}

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string; genre?: string; q?: string; sort?: string; minPrice?: string; maxPrice?: string }>;
}) {
  const params = await searchParams;
  const games = await getGames(params.platform, params.genre, params.q, params.sort, params.minPrice, params.maxPrice);

  const platforms = ["Steam", "Epic Games", "Xbox", "PlayStation", "Nintendo"];
  const genres = ["Aksiyon", "RPG", "Spor", "Strateji", "Simülasyon", "Bulmaca", "Macera"];
  const sorts = [
    { value: "", label: "En Yeni" },
    { value: "price_asc", label: "Fiyat: Düşük → Yüksek" },
    { value: "price_desc", label: "Fiyat: Yüksek → Düşük" },
    { value: "title", label: "A → Z" },
  ];

  const hasFilter = params.platform || params.genre || params.q || params.sort || params.minPrice || params.maxPrice;

  const inputClass =
    "w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FFF785]/60 focus:bg-white/[0.07] transition";

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-100">
      <Header />

      {/* Hero başlık */}
      <section className="relative pt-32 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0 red-glow opacity-40" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#FFF785]/10 blur-[100px]" />
        <div className="relative max-w-7xl mx-auto">
          <span className="inline-block bg-[#FFF785]/10 text-[#FFF785] text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-[#FFF785]/20">
            Katalog
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tight">
            Oyunlar
          </h1>
          <p className="text-gray-400 mt-3">{games.length} oyun listeleniyor</p>
        </div>
      </section>

      <main className="flex-1 px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Filtreler */}
          <div className="bg-[#111111] rounded-3xl border border-white/5 p-5 mb-6">
            <form method="GET" className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-48">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Ara</label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input name="q" defaultValue={params.q} placeholder="Oyun ara..." className={inputClass + " pl-9"} />
                </div>
              </div>
              <div className="min-w-36">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Platform</label>
                <select name="platform" defaultValue={params.platform || ""} className={inputClass}>
                  <option value="">Tümü</option>
                  {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="min-w-32">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Tür</label>
                <select name="genre" defaultValue={params.genre || ""} className={inputClass}>
                  <option value="">Tümü</option>
                  {genres.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="flex gap-2 items-end">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Min ₺</label>
                  <input name="minPrice" type="number" defaultValue={params.minPrice} placeholder="0" min="0" className={inputClass + " w-20"} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Max ₺</label>
                  <input name="maxPrice" type="number" defaultValue={params.maxPrice} placeholder="∞" min="0" className={inputClass + " w-20"} />
                </div>
              </div>
              <div className="min-w-44">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Sırala</label>
                <select name="sort" defaultValue={params.sort || ""} className={inputClass}>
                  {sorts.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] px-5 py-2.5 rounded-xl text-sm font-semibold transition">
                  Filtrele
                </button>
                {hasFilter && <a href="/games" className="border border-white/10 text-gray-300 px-4 py-2.5 rounded-xl text-sm hover:bg-white/5 transition">Temizle</a>}
              </div>
            </form>
          </div>

          {/* Aktif filtreler */}
          {hasFilter && (
            <div className="flex flex-wrap gap-2 mb-6">
              {params.q && <span className="bg-[#FFF785]/10 text-[#FFF785] border border-[#FFF785]/20 text-xs px-3 py-1.5 rounded-full">"{params.q}"</span>}
              {params.platform && <span className="bg-white/5 text-gray-300 border border-white/10 text-xs px-3 py-1.5 rounded-full">{params.platform}</span>}
              {params.genre && <span className="bg-white/5 text-gray-300 border border-white/10 text-xs px-3 py-1.5 rounded-full">{params.genre}</span>}
              {(params.minPrice || params.maxPrice) && <span className="bg-white/5 text-gray-300 border border-white/10 text-xs px-3 py-1.5 rounded-full">₺{params.minPrice || "0"} – ₺{params.maxPrice || "∞"}</span>}
            </div>
          )}

          {/* Oyun Grid */}
          {games.length === 0 ? (
            <div className="text-center py-24 bg-[#111111] rounded-3xl border border-white/5">
              <Gamepad2 size={42} className="text-white/10 mx-auto mb-4" />
              <p className="text-gray-300 text-lg font-semibold">Oyun bulunamadı.</p>
              <p className="text-gray-500 text-sm mt-1">Filtrelerinizi gözden geçirmeyi deneyin.</p>
              <a href="/games" className="inline-flex items-center gap-2 text-[#FFF785] hover:text-[#FFF785] text-sm mt-4">
                Tüm oyunlara dön <ArrowUpRight size={14} />
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {games.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
