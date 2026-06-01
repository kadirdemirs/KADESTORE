"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import AccountCard, { LibraryItem } from "@/components/AccountCard";
import { Key, Trophy, ShoppingBag, Gamepad2, Shield, Plus, User as UserIcon } from "lucide-react";
import { RANKS, rankFromPoints } from "@/lib/utils";
import { Skeleton, AccountCardSkeleton } from "@/components/Skeleton";

const RANK_COLORS: Record<string, string> = {
  Bronze: "text-orange-400", Silver: "text-gray-300", Gold: "text-yellow-400",
  Platinum: "text-cyan-400", Diamond: "text-blue-400", Elite: "text-purple-400", none: "text-gray-500",
};

type Tab = "library" | "purchased" | "rewards";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("library");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?redirect=/profile");
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/profile/library").then((r) => r.json()),
      fetch("/api/users/me").then((r) => r.json()),
    ]).then(([libData, meData]) => {
      setLibrary(libData.library || []);
      setUserData(meData.user);
      setLoading(false);
    });
  }, [status]);

  const purchased = library.filter((k) => k.source === "purchase");

  const points = userData?.points ?? 0;
  const rank = userData?.rank && userData.rank !== "none" ? userData.rank : rankFromPoints(points);
  const rankColor = RANK_COLORS[rank] || RANK_COLORS.none;
  const rankLabel = rank === "none" ? "Rütbesiz" : `KadeStore | ${rank}`;

  const nextRank = RANKS.find((r) => r.required > points);
  const remaining = nextRank ? nextRank.required - points : 0;

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-100">
        <Header />
        <main className="flex-1 pt-32 pb-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 red-glow opacity-30" />
          <div className="relative max-w-5xl mx-auto">
            <div className="mb-10 space-y-3">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-12 w-72" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-24 w-full mb-5 rounded-3xl" />
            <Skeleton className="h-44 w-full mb-6 rounded-3xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <AccountCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const list = tab === "purchased" ? purchased : library;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-100">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 red-glow opacity-30" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#FFF785]/10 blur-[120px]" />

        <div className="relative max-w-5xl mx-auto">
          <div className="mb-10">
            <span className="inline-block bg-[#FFF785]/10 text-[#FFF785] text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-[#FFF785]/20">
              <UserIcon size={12} className="inline -mt-0.5 mr-1" /> Hesabım
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight">Oyunlarım</h1>
            <p className="text-gray-400 mt-3 max-w-2xl">Hesap bilgileriniz ve satın aldığınız oyunların erişim detayları.</p>
          </div>

          {/* Profil özeti */}
          <div className="bg-[#111111] rounded-3xl border border-white/5 shadow-2xl p-5 mb-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF785] flex items-center justify-center text-[#0a0a0a] text-xl font-display font-black flex-shrink-0">
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold text-white truncate text-lg">{session?.user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${rankColor}`}>{rankLabel}</p>
              <p className="text-xs text-gray-500">{library.length} oyun</p>
            </div>
            <Link
              href="/games"
              className="hidden sm:inline-flex items-center gap-2 border border-white/10 text-gray-200 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/5 transition"
            >
              <Plus size={15} /> Oyun Al
            </Link>
          </div>

          {/* Rank paneli */}
          <div className="bg-[#111111] border border-[#FFF785]/15 rounded-3xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#FFF785]/10 blur-3xl" />
            <div className="relative flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF785]/15 border border-[#FFF785]/20 flex items-center justify-center flex-shrink-0">
                <Trophy size={22} className="text-[#FFF785]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFF785]">Rank</p>
                <p className={`font-display text-xl font-black ${rankColor} mt-0.5`}>{rankLabel}</p>
                <p className="text-sm text-gray-300 mt-2">
                  Bu dönemde anahtar kullanarak yaptığınız toplam oyun seçimi: <strong className="text-white">{points}</strong>.
                </p>
                {nextRank ? (
                  <p className="text-sm text-[#FFF785] mt-1">
                    «KadeStore | {nextRank.name}» için <strong>{remaining}</strong> oyun seçimi daha yapmalısınız.
                  </p>
                ) : (
                  <p className="text-sm text-[#FFF785] mt-1">En yüksek kademeye ulaştınız.</p>
                )}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FFF785] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((points / 60) * 100, 100)}%` }}
                    />
                  </div>
                  <Link href="/rewards" className="text-sm text-[#FFF785] hover:text-[#FFF785] font-medium whitespace-nowrap">
                    Tüm ranklar →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Hızlı aksiyonlar */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link href="/redeem" className="inline-flex items-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] px-4 py-2.5 rounded-full text-sm font-medium transition">
              <Key size={15} /> Kod Etkinleştir
            </Link>
            <Link href="/guard" className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2.5 rounded-full text-sm font-medium transition">
              <Shield size={15} /> Guard Kodu Al
            </Link>
            <Link href="/rewards" className="inline-flex items-center gap-2 border border-white/10 text-gray-200 px-4 py-2.5 rounded-full text-sm font-medium hover:bg-white/5 transition">
              <Trophy size={15} /> Ödüller
            </Link>
          </div>

          {/* Sekmeler */}
          <div className="flex gap-1 bg-[#111111] border border-white/5 rounded-full p-1 mb-6 w-fit">
            {([
              { id: "library" as Tab, label: `Kütüphane (${library.length})` },
              { id: "purchased" as Tab, label: `Satın Alınanlar (${purchased.length})` },
              { id: "rewards" as Tab, label: "Ödüller" },
            ]).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  tab === t.id ? "bg-[#FFF785] text-[#0a0a0a]" : "text-gray-400 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* İçerik */}
          {tab === "rewards" ? (
            <div className="bg-[#111111] rounded-3xl border border-white/5 shadow-2xl p-10 text-center">
              <Trophy size={36} className="text-[#FFF785] mx-auto mb-4" />
              <p className="text-white font-semibold text-lg mb-1">
                Mevcut Puanınız: <span className="text-[#FFF785]">{points}</span>
              </p>
              <p className="text-sm text-gray-400 mb-5">
                Rank: <span className={`font-semibold ${rankColor}`}>{rankLabel}</span>
              </p>
              <Link href="/rewards" className="inline-flex items-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] px-5 py-2.5 rounded-full text-sm font-semibold transition">
                Tüm Ödülleri Gör
              </Link>
            </div>
          ) : list.length === 0 ? (
            <div className="bg-[#111111] rounded-3xl border border-white/5 shadow-2xl p-14 text-center">
              <Gamepad2 size={40} className="text-white/10 mx-auto mb-4" />
              <p className="text-gray-300 text-base font-semibold mb-1">
                {tab === "purchased" ? "Henüz satın alma yok." : "Henüz oyun yok."}
              </p>
              <p className="text-gray-500 text-sm mb-5">Hemen kataloğumuza göz atın.</p>
              <div className="flex gap-3 justify-center">
                <Link href="/games" className="inline-flex items-center gap-2 bg-[#FFF785] text-[#0a0a0a] px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-[#FFE74F] transition">
                  <ShoppingBag size={15} /> Oyun Satın Al
                </Link>
                <Link href="/redeem" className="inline-flex items-center gap-2 border border-white/10 text-gray-200 px-4 py-2.5 rounded-full text-sm hover:bg-white/5 transition">
                  <Key size={15} /> Kod Gir
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((item) => (
                <AccountCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
