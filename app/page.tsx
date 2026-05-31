import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TickerBar from "@/components/TickerBar";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Zap, Shield, Headphones, ArrowRight } from "lucide-react";

async function getData() {
  const [games, totalUsers, totalGames, recentReviews] = await Promise.all([
    prisma.game.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.user.count(),
    prisma.game.count({ where: { isActive: true } }),
    prisma.review.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);
  return { games, totalUsers, totalGames, recentReviews };
}

export default async function Home() {
  const { games, totalUsers, totalGames, recentReviews } = await getData();

  const reviews =
    recentReviews.length > 0
      ? recentReviews
      : [
          { id: "1", comment: "Harika bir platform! Hızlı teslimat ve uygun fiyatlar. Her şey sorunsuz çalışıyor.", rating: 5, user: { name: "Ahmet K." } },
          { id: "2", comment: "Anahtarlar anında geldi. Çok memnunum!", rating: 5, user: { name: "Melis D." } },
          { id: "3", comment: "Fiyatlar çok uygun, hizmet kalitesi mükemmel.", rating: 5, user: { name: "Emre S." } },
        ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <TickerBar games={games} />

      {/* Hero */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              AKTİF &amp; GÜVENİLİR
            </div>
            <h1 className="text-5xl font-black text-gray-900 leading-tight mb-4">
              Dijital oyunlarda{" "}
              <span className="text-amber-500">en iyi adres.</span>
            </h1>
            <p className="text-gray-500 text-lg mb-8 max-w-md">
              Uygun fiyatlar, anında teslimat ve kesintisiz destek ile oyun deneyiminizi bir üst seviyeye taşıyın.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/games" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold transition">
                Oyunları Keşfet <ArrowRight size={18} />
              </Link>
              <Link href="/register" className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">
                Ücretsiz Kayıt
              </Link>
            </div>
            <div className="flex items-center gap-3 mt-8">
              <div className="flex -space-x-2">
                {["A", "Z", "M", "S"].map((l) => (
                  <div key={l} className="w-8 h-8 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">{l}</div>
                ))}
              </div>
              <div>
                <div className="flex text-amber-400 text-sm">★★★★★</div>
                <p className="text-xs text-gray-500">
                  {totalUsers > 9000 ? `${(totalUsers / 1000).toFixed(0)}K+` : "9,000+"} mutlu kullanıcı
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-gray-900 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                  <Zap size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold">Anında Teslimat</p>
                  <p className="text-xs text-gray-400">Ortalama 30 saniye</p>
                </div>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-4/5"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <p className="text-3xl font-black text-gray-900">{totalGames > 0 ? `${totalGames}+` : "500+"}</p>
                <p className="text-sm text-gray-500">Oyun çeşidi</p>
              </div>
              <div className="bg-green-500 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={16} />
                  <p className="font-semibold text-sm">Güvenli Alışveriş</p>
                </div>
                <p className="text-xs opacity-80">256-bit şifreleme</p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-gray-500 mb-1">MÜŞTERİ MEMNUNİYETİ</p>
              <div className="flex items-end gap-2">
                <p className="text-4xl font-black text-gray-900">4.9</p>
                <div className="flex text-amber-400 mb-1 text-sm">★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-black text-gray-900">{totalUsers > 9000 ? `${(totalUsers / 1000).toFixed(0)}K+` : "9K+"}</p>
            <p className="text-sm text-gray-500 mt-1">Aktif Kullanıcı</p>
          </div>
          <div>
            <p className="text-4xl font-black text-gray-900">{totalGames > 0 ? `${totalGames}+` : "500+"}</p>
            <p className="text-sm text-gray-500 mt-1">Dijital Oyun</p>
          </div>
          <div>
            <p className="text-4xl font-black text-gray-900">4.9/5</p>
            <p className="text-sm text-gray-500 mt-1">Kullanıcı Puanı</p>
          </div>
        </div>
      </section>

      {/* Game Grid */}
      {games.length > 0 && (
        <section className="bg-white py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Öne Çıkan Oyunlar</h2>
              <Link href="/games" className="text-sm text-amber-500 hover:text-amber-600 font-medium flex items-center gap-1">
                Tümünü Gör <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {games.map((game) => (
                <Link key={game.id} href={`/games/${game.slug}`} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition hover:border-amber-200">
                  <div className="h-36 bg-gradient-to-br from-amber-400 to-orange-500 relative overflow-hidden">
                    {game.imageUrl && (
                      <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    )}
                    <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">{game.platform}</span>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-900 truncate">{game.title}</p>
                    <p className="text-amber-500 font-bold text-sm mt-1">₺{game.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why KadeStore */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="text-amber-500 text-xs font-bold uppercase tracking-wider mb-2">AVANTAJLARIMIZ</p>
            <h2 className="text-3xl font-bold text-gray-900">Neden KadeStore?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-2xl p-6 text-white">
              <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center mb-4">
                <Zap size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Anında Teslimat</h3>
              <p className="text-gray-400 text-sm">Satın alma işlemi tamamlandıktan sonra oyununuz saniyeler içinde hesabınıza tanımlanır.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                <Shield size={24} className="text-green-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Kesintisiz Hizmet</h3>
              <p className="text-gray-500 text-sm">Sunucularımız her zaman aktif. Oyunlarınıza istediğiniz zaman erişin.</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs text-green-600 font-medium">Sistem aktif</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <Headphones size={24} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Hızlı Destek</h3>
              <p className="text-gray-500 text-sm">Sorun yaşandığında hızlı ve çözüm odaklı destek ekibimiz yanınızda.</p>
              <p className="text-xs text-blue-600 font-medium mt-3">Ort. yanıt süresi: &lt;15 dk</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-wider mb-2">ADIM ADIM</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Nasıl çalışır?</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            {[
              { step: "1", title: "Kayıt Ol", desc: "Ücretsiz hesap oluştur" },
              { step: "2", title: "Anahtar Al", desc: "İstediğin oyunu satın al" },
              { step: "3", title: "Oyna!", desc: "Anında hesabına tanımla" },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center text-white font-black text-lg mb-3">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-amber-500 text-xs font-bold uppercase tracking-wider mb-2">KULLANICI YORUMLARI</p>
            <h2 className="text-3xl font-bold text-gray-900">Müşterilerimiz ne diyor?</h2>
            <p className="text-gray-500 mt-2 text-sm">Binlerce kullanıcımız bize güveniyor.</p>
          </div>
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div key={review.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex text-amber-400 text-sm mb-2">{"★".repeat(review.rating)}</div>
                <p className="text-gray-700 text-sm italic">&ldquo;{review.comment}&rdquo;</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">
                    {review.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{review.user.name}</p>
                    <p className="text-xs text-gray-400">Doğrulanmış Kullanıcı</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Hemen başlayın, oyun dünyasına adım atın.</h2>
            <p className="text-gray-400 text-sm mb-6">Ücretsiz hesap oluşturun, mağazadaki yüzlerce oyunu keşfedin.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/games" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold transition">
                Alışverişe Başla <ArrowRight size={18} />
              </Link>
              <Link href="/register" className="inline-flex items-center gap-2 border border-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition">
                Kayıt Ol
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-4xl font-black text-white">{totalGames > 0 ? `${totalGames}+` : "500+"}</p>
              <p className="text-gray-400 text-sm">oyun sizi bekliyor</p>
            </div>
            <div>
              <p className="text-4xl font-black text-white">{totalUsers > 9000 ? `${(totalUsers / 1000).toFixed(0)}K+` : "9K+"}</p>
              <p className="text-gray-400 text-sm">KULLANICI</p>
            </div>
            <div>
              <p className="text-4xl font-black text-white">7/24</p>
              <p className="text-gray-400 text-sm">DESTEK</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
