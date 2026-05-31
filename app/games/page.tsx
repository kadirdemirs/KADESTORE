import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oyunlar",
  description: "KadeStore'da 500+ dijital oyun keşfedin. Steam, Epic Games, Xbox ve daha fazlası.",
};

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

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-950">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-950 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Oyunlar</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{games.length} oyun listeleniyor</p>
          </div>

          {/* Filtreler */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 mb-6">
            <form method="GET" className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-48">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Ara</label>
                <input name="q" defaultValue={params.q} placeholder="Oyun ara..."
                  className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400 transition" />
              </div>
              <div className="min-w-36">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Platform</label>
                <select name="platform" defaultValue={params.platform || ""}
                  className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400">
                  <option value="">Tümü</option>
                  {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="min-w-32">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tür</label>
                <select name="genre" defaultValue={params.genre || ""}
                  className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400">
                  <option value="">Tümü</option>
                  {genres.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="flex gap-2 items-end">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Min ₺</label>
                  <input name="minPrice" type="number" defaultValue={params.minPrice} placeholder="0" min="0"
                    className="w-20 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Max ₺</label>
                  <input name="maxPrice" type="number" defaultValue={params.maxPrice} placeholder="∞" min="0"
                    className="w-20 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                </div>
              </div>
              <div className="min-w-44">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Sırala</label>
                <select name="sort" defaultValue={params.sort || ""}
                  className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400">
                  {sorts.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-xl text-sm font-medium transition">
                  Filtrele
                </button>
                {hasFilter && <a href="/games" className="border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">Temizle</a>}
              </div>
            </form>
          </div>

          {/* Aktif filtreler */}
          {hasFilter && (
            <div className="flex flex-wrap gap-2 mb-4">
              {params.q && <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs px-3 py-1 rounded-full">"{params.q}"</span>}
              {params.platform && <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs px-3 py-1 rounded-full">{params.platform}</span>}
              {params.genre && <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs px-3 py-1 rounded-full">{params.genre}</span>}
              {(params.minPrice || params.maxPrice) && <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-3 py-1 rounded-full">₺{params.minPrice || "0"} – ₺{params.maxPrice || "∞"}</span>}
            </div>
          )}

          {/* Oyun Grid */}
          {games.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <p className="text-gray-400 text-lg">Oyun bulunamadı.</p>
              <a href="/games" className="text-amber-500 hover:text-amber-600 text-sm mt-2 inline-block">Tüm oyunlara dön →</a>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {games.map(game => (
                <Link key={game.id} href={`/games/${game.slug}`}
                  className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-md dark:hover:shadow-gray-900 transition hover:border-amber-200 dark:hover:border-amber-700">
                  <div className="h-36 bg-gradient-to-br from-amber-400 to-orange-500 relative overflow-hidden">
                    {game.imageUrl && (
                      <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">{game.platform}</span>
                    </div>
                    {game._count.keys === 0 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">Stokta Yok</span>
                      </div>
                    )}
                    {game.isFeatured && <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">Öne Çıkan</span>}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{game.genre}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2 mb-2">{game.title}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-amber-500 font-bold">₺{game.price.toFixed(2)}</p>
                      <span className="text-xs text-gray-400">{game._count.keys} stok</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
