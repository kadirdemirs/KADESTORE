import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TickerBar from "@/components/TickerBar";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Zap, ShieldCheck, Headphones, ArrowUpRight, Gamepad2, KeyRound, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import HeroBackdrop from "@/components/HeroBackdrop";
import GameCard from "@/components/GameCard";

export const dynamic = "force-dynamic";

async function getData() {
  const [games, totalUsers, totalGames, recentReviews] = await Promise.all([
    prisma.game.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.user.count(),
    prisma.game.count({ where: { isActive: true } }),
    prisma.review.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);
  return { games, totalUsers, totalGames, recentReviews };
}

const SERVICES = [
  {
    title: "Anında Teslimat",
    desc: "Ödeme tamamlandıktan saniyeler sonra anahtar veya hesap bilgileri otomatik olarak hesabınıza tanımlanır.",
    icon: Zap,
    href: "/games",
  },
  {
    title: "Güvenli Alışveriş",
    desc: "256-bit SSL şifreleme ve Shopier altyapısı ile ödemeleriniz tamamen güvende. Hiçbir bilgi 3. taraflarla paylaşılmaz.",
    icon: ShieldCheck,
    href: "/privacy",
  },
  {
    title: "Steam Guard Kodu",
    desc: "Hazır hesap satın alanlar için yerleşik Steam Guard üreteci — 30 saniyede bir taze kod, herhangi bir uygulamaya gerek yok.",
    icon: KeyRound,
    href: "/guard",
  },
  {
    title: "7/24 Hızlı Destek",
    desc: "Ortalama 15 dakika içinde yanıt veren, çözüm odaklı destek ekibimiz her zaman ulaşılabilir.",
    icon: Headphones,
    href: "/verify",
  },
];

export default async function Home() {
  const { games, totalUsers, totalGames, recentReviews } = await getData();

  const reviews =
    recentReviews.length > 0
      ? recentReviews
      : [
          { id: "1", comment: "Harika bir platform! Hızlı teslimat ve uygun fiyatlar. Her şey sorunsuz çalışıyor.", rating: 5, user: { name: "Ahmet K." } },
          { id: "2", comment: "Anahtarlar anında geldi, Steam Guard üreteci özelliği inanılmaz pratik.", rating: 5, user: { name: "Melis D." } },
          { id: "3", comment: "Fiyatlar çok uygun, destek ekibi her sorunu hızlıca çözdü.", rating: 5, user: { name: "Emre S." } },
        ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-100">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden pt-32 pb-32 px-4">
        {/* Glow */}
        <div className="absolute inset-0 red-glow opacity-70" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[#FFF785]/10 blur-[120px]" />

        {/* Grain */}
        <div className="absolute inset-0 grain" />

        {/* Controller SVG + rays */}
        <HeroBackdrop />

        {/* Sol köşe meta */}
        <div className="absolute top-32 left-6 hidden md:block">
          <p className="text-[10px] font-bold text-[#FFF785] tracking-[0.3em] mb-3">TESLİMAT.</p>
          <p className="text-[10px] font-bold text-[#FFF785] tracking-[0.3em] mb-3">GÜVENLİK.</p>
          <p className="text-[10px] font-bold text-[#FFF785] tracking-[0.3em]">DESTEK.</p>
        </div>

        {/* Sağ köşe süreç adımları */}
        <div className="absolute top-32 right-6 hidden md:block text-right">
          <p className="text-[10px] text-gray-500 tracking-[0.2em] mb-1">01 // KATALOG</p>
          <p className="text-[10px] text-gray-500 tracking-[0.2em] mb-1">02 // ÖDEME</p>
          <p className="text-[10px] text-gray-500 tracking-[0.2em] mb-1">03 // TESLİMAT</p>
          <p className="text-[10px] text-[#FFF785] tracking-[0.2em]">04 // OYNA</p>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <Reveal y={28} delay={0.05}>
            <h1 className="font-display text-[18vw] md:text-[14rem] lg:text-[18rem] leading-[0.85] font-black text-white tracking-tighter">
              kade<span className="text-[#FFF785]">store</span>
            </h1>
          </Reveal>

          <Reveal y={20} delay={0.15}>
            <p className="text-xs md:text-sm tracking-[0.4em] text-gray-400 uppercase mt-6">
              <span className="text-white">Dijital</span> oyunlar <span className="text-[#FFF785]">anında teslim.</span>
            </p>
          </Reveal>

          <Reveal y={20} delay={0.25}>
            <div className="flex flex-wrap justify-center items-center gap-3 mt-10">
              <Link
                href="/games"
                className="group inline-flex items-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] px-7 py-3.5 rounded-full text-sm font-semibold transition shadow-[0_20px_50px_-15px_rgba(255,247,133,0.7)]"
              >
                Oyunları Keşfet
                <span className="w-6 h-6 rounded-full bg-[#0a0a0a]/15 flex items-center justify-center group-hover:bg-[#0a0a0a]/30 transition">
                  <ArrowUpRight size={14} />
                </span>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur border border-white/10 text-white px-7 py-3.5 rounded-full text-sm font-semibold transition"
              >
                Ücretsiz Kayıt
              </Link>
            </div>
          </Reveal>

          {/* Mini stats */}
          <Reveal y={20} delay={0.35}>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 mt-16 text-left">
              <div>
                <p className="font-display text-4xl md:text-5xl font-black text-white">
                  <CountUp to={totalUsers > 9000 ? Math.round(totalUsers / 1000) : 9} suffix="K+" />
                </p>
                <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase mt-1">Mutlu Müşteri</p>
              </div>
              <div className="w-px h-12 bg-white/10 hidden md:block" />
              <div>
                <p className="font-display text-4xl md:text-5xl font-black text-white">
                  <CountUp to={totalGames > 0 ? totalGames : 500} suffix="+" />
                </p>
                <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase mt-1">Dijital Oyun</p>
              </div>
              <div className="w-px h-12 bg-white/10 hidden md:block" />
              <div>
                <p className="font-display text-4xl md:text-5xl font-black text-white">
                  <CountUp to={4.9} decimals={1} /><span className="text-[#FFF785]">/5</span>
                </p>
                <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase mt-1">Kullanıcı Puanı</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Brand strip / kategori marquee (geido referansındaki gibi) */}
      <div className="border-y border-white/5 bg-black overflow-hidden">
        <div className="flex marquee-x" style={{ width: "max-content" }}>
          {[...Array(2)].flatMap((_, k) =>
            ["STEAM", "EPIC GAMES", "XBOX", "PLAYSTATION", "NINTENDO", "GOG", "UBISOFT", "BATTLE.NET"].map((p) => (
              <div key={`${k}-${p}`} className="flex items-center gap-12 px-12 py-4 flex-shrink-0">
                <span className="text-xl md:text-2xl font-display font-black text-white/80 tracking-tight">{p}</span>
                <span className="text-[#FFF785] text-lg">●</span>
              </div>
            ))
          )}
        </div>
      </div>

      <TickerBar games={games} />

      {/* HİZMETLER (4 kırmızı kart) */}
      <section className="bg-[#0a0a0a] py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="inline-block bg-[#FFF785]/10 text-[#FFF785] text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-[#FFF785]/20">
                Hizmetlerimiz
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-black text-white leading-tight max-w-2xl">
                Oyun deneyiminizi
                <br />
                <span className="text-gray-500">bir üst seviyeye taşıyan</span> servis.
              </h2>
            </div>
            <Link
              href="/games"
              className="self-start inline-flex items-center gap-2 border border-white/15 hover:bg-white/5 text-white px-5 py-2.5 rounded-full text-sm transition whitespace-nowrap"
            >
              Detaylı Bilgi
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                <ArrowUpRight size={12} />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.title} delay={i * 0.06}>
                  <Link
                    href={s.href}
                    className="group relative flex flex-col justify-between h-full bg-[#FFF785] hover:bg-[#FFE74F] rounded-3xl p-6 overflow-hidden transition min-h-[260px]"
                  >
                    {/* Decorative corner glow */}
                    <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-black/10 blur-2xl opacity-0 group-hover:opacity-100 transition" />
                    <div className="relative flex items-start justify-between">
                      <Icon size={28} className="text-[#0a0a0a]" strokeWidth={2.2} />
                      <span className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-[#0a0a0a] group-hover:text-[#FFF785] text-[#0a0a0a] transition">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                    <div className="relative">
                      <h3 className="font-display text-xl font-bold text-[#0a0a0a] mb-2">{s.title}</h3>
                      <p className="text-sm text-[#0a0a0a]/75 leading-relaxed">{s.desc}</p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ÖNE ÇIKAN OYUNLAR */}
      {games.length > 0 && (
        <section className="bg-[#0a0a0a] py-24 px-4 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <span className="inline-block bg-[#FFF785]/10 text-[#FFF785] text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-[#FFF785]/20">
                  Kataloğumuz
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-black text-white leading-tight">
                  Fark Yaratan Oyunlar
                  <br />
                  <span className="text-gray-500">Stokta sizi bekliyor</span>
                </h2>
              </div>
              <Link
                href="/games"
                className="self-start inline-flex items-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] px-5 py-2.5 rounded-full text-sm font-semibold transition whitespace-nowrap"
              >
                Tüm Oyunları Gör
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowUpRight size={12} />
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {games.map((game, i) => (
                <Reveal key={game.id} delay={Math.min(i, 7) * 0.04}>
                  <GameCard game={game} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NASIL ÇALIŞIR */}
      <section className="bg-[#0a0a0a] py-24 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-[#FFF785]/10 text-[#FFF785] text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-[#FFF785]/20">
              Süreç
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white">
              Üç adımda <span className="text-[#FFF785]">oyunda</span>.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Kayıt Ol", desc: "Saniyeler içinde ücretsiz hesap oluştur." },
              { step: "02", title: "Anahtar Al", desc: "İstediğin oyunu seç, güvenle satın al." },
              { step: "03", title: "Oyna", desc: "Anında hesabına tanımla, oynamaya başla." },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 0.08}>
                <div className="relative bg-[#111111] border border-white/5 rounded-3xl p-8 h-full hover:border-[#FFF785]/30 transition">
                  <p className="font-display text-7xl font-black text-[#FFF785]/20 leading-none">{item.step}</p>
                  <h3 className="font-display text-2xl font-bold text-white mt-6">{item.title}</h3>
                  <p className="text-sm text-gray-400 mt-2 leading-relaxed">{item.desc}</p>
                  <Sparkles size={16} className="absolute top-6 right-6 text-[#FFF785]/40" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MÜŞTERİ YORUMLARI (Blog gibi 3 büyük kart) */}
      <section className="bg-[#0a0a0a] py-24 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="inline-block bg-[#FFF785]/10 text-[#FFF785] text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-[#FFF785]/20">
                Topluluk
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-black text-white leading-tight">
                Müşterilerimiz
                <br />
                <span className="text-gray-500">ne diyor?</span>
              </h2>
            </div>
            <Link
              href="/register"
              className="self-start inline-flex items-center gap-2 border border-white/15 hover:bg-white/5 text-white px-5 py-2.5 rounded-full text-sm transition whitespace-nowrap"
            >
              Sen de Katıl
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                <ArrowUpRight size={12} />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map((review: any, i: number) => (
              <Reveal key={review.id} delay={i * 0.08}>
                <div className="bg-[#111111] border border-white/5 rounded-3xl overflow-hidden hover:border-[#FFF785]/30 transition group h-full flex flex-col">
                  <div className="h-44 bg-gradient-to-br from-[#FFE74F]/40 via-[#1a1a1a] to-[#0a0a0a] relative flex items-center justify-center">
                    <span className="font-display text-7xl font-black text-white/10">"</span>
                    <div className="absolute inset-0 grain opacity-50" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-500 mb-3">
                      <span>KADESTORE</span>
                      <span className="text-[#FFF785]">●</span>
                      <span>Doğrulanmış</span>
                    </div>
                    <p className="text-white font-medium leading-relaxed flex-1">"{review.comment}"</p>
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#FFF785] flex items-center justify-center text-[#0a0a0a] text-xs font-bold">
                          {review.user.name.charAt(0)}
                        </div>
                        <p className="text-sm text-white font-semibold">{review.user.name}</p>
                      </div>
                      <div className="text-[#FFF785] text-sm">{"★".repeat(review.rating)}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SİYAH BLOK */}
      <section className="bg-black py-24 px-4 relative overflow-hidden border-t border-white/5">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#FFF785]/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#FFF785]/10 blur-[120px]" />
        <div className="absolute inset-0 grain opacity-60" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-[#FFF785]/10 text-[#FFF785] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-[#FFF785]/20">
              Başlayalım
            </span>
            <h2 className="font-display text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tight">
              Oyun dünyasına
              <br />
              <span className="text-[#FFF785]">adım atın.</span>
            </h2>
            <p className="text-gray-400 mt-6 max-w-md">
              Ücretsiz hesap oluşturun, dakikalar içinde ilk oyununuza sahip olun.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/games"
                className="group inline-flex items-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] px-7 py-3.5 rounded-full text-sm font-semibold transition shadow-[0_20px_50px_-15px_rgba(255,247,133,0.7)]"
              >
                Alışverişe Başla
                <span className="w-6 h-6 rounded-full bg-[#0a0a0a]/15 flex items-center justify-center group-hover:bg-[#0a0a0a]/30 transition">
                  <ArrowUpRight size={14} />
                </span>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur border border-white/10 text-white px-7 py-3.5 rounded-full text-sm font-semibold transition"
              >
                Ücretsiz Kayıt
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="font-display text-5xl font-black text-white">
                <CountUp to={totalGames > 0 ? totalGames : 500} suffix="+" />
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-wider mt-2">Oyun çeşidi</p>
            </div>
            <div className="bg-[#FFF785] rounded-3xl p-6">
              <p className="font-display text-5xl font-black text-[#0a0a0a]">7/24</p>
              <p className="text-xs text-[#0a0a0a]/70 uppercase tracking-wider mt-2 font-semibold">Aktif Destek</p>
            </div>
            <div className="bg-[#FFF785] rounded-3xl p-6">
              <p className="font-display text-5xl font-black text-[#0a0a0a]">
                <CountUp to={totalUsers > 9000 ? Math.round(totalUsers / 1000) : 9} suffix="K+" />
              </p>
              <p className="text-xs text-[#0a0a0a]/70 uppercase tracking-wider mt-2 font-semibold">Mutlu Müşteri</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur">
              <p className="font-display text-5xl font-black text-white">~<CountUp to={30} /><span className="text-[#FFF785]">sn</span></p>
              <p className="text-xs text-gray-400 uppercase tracking-wider mt-2">Ort. Teslimat</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
