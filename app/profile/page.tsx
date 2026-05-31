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

const RANK_COLORS: Record<string, string> = {
  Bronze: "text-amber-600", Silver: "text-gray-500", Gold: "text-yellow-500",
  Platinum: "text-cyan-500", Diamond: "text-blue-500", Elite: "text-purple-500", none: "text-gray-400",
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
  const redeemed = library.filter((k) => k.source === "redeem");

  const points = userData?.points ?? 0;
  // rank alanı boşsa puandan türet — eski "—" hatasını giderir
  const rank = userData?.rank && userData.rank !== "none" ? userData.rank : rankFromPoints(points);
  const rankColor = RANK_COLORS[rank] || RANK_COLORS.none;
  const rankLabel = rank === "none" ? "Rütbesiz" : `KadeStore | ${rank}`;

  // Bir sonraki kademeye kalan
  const nextRank = RANKS.find((r) => r.required > points);
  const remaining = nextRank ? nextRank.required - points : 0;

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  const list = tab === "purchased" ? purchased : library;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-950 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Başlık */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider mb-2">
              <UserIcon size={15} /> HESABIM
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Oyunlarım</h1>
            <p className="text-gray-500 mt-2">Hesap bilgileriniz ve satın aldığınız oyunların erişim detayları.</p>
          </div>

          {/* Profil özeti */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 mb-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white text-xl font-black flex-shrink-0">
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-gray-900 dark:text-white truncate">{session?.user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${rankColor}`}>{rankLabel}</p>
              <p className="text-xs text-gray-400">{library.length} oyun</p>
            </div>
            <Link
              href="/games"
              className="hidden sm:inline-flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <Plus size={15} /> Oyun Al
            </Link>
          </div>

          {/* RANK paneli */}
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Trophy size={20} className="text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600">RANK</p>
                <p className={`text-lg font-black ${rankColor}`}>{rankLabel}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Bu dönemde anahtar kullanarak yaptığınız toplam oyun seçimi: <strong>{points}</strong>. Her anahtarda
                  seçtiğiniz oyunlar bu sayıya eklenir.
                </p>
                {nextRank ? (
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                    «KadeStore | {nextRank.name}» kademesine ulaşmak için bu dönemde <strong>{remaining}</strong> oyun
                    seçimi daha yapmalısınız.
                  </p>
                ) : (
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">En yüksek kademeye ulaştınız! 🎉</p>
                )}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-2 bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((points / 60) * 100, 100)}%` }}
                    />
                  </div>
                  <Link href="/rewards" className="text-sm text-amber-600 hover:underline font-medium whitespace-nowrap">
                    Tüm ranklar →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Hızlı aksiyonlar */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Link href="/redeem" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
              <Key size={15} /> Kod Etkinleştir
            </Link>
            <Link href="/guard" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
              <Shield size={15} /> Kod Al
            </Link>
            <Link href="/rewards" className="inline-flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <Trophy size={15} /> Ödüller
            </Link>
          </div>

          {/* Sekmeler */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6 w-fit">
            {([
              { id: "library" as Tab, label: `Kütüphane (${library.length})` },
              { id: "purchased" as Tab, label: `Satın Alınanlar (${purchased.length})` },
              { id: "rewards" as Tab, label: "Ödüller" },
            ]).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  tab === t.id ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* İçerik */}
          {tab === "rewards" ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 text-center">
              <Trophy size={32} className="text-amber-500 mx-auto mb-3" />
              <p className="text-gray-700 dark:text-gray-200 font-semibold mb-1">
                Mevcut Puanınız: <span className="text-amber-500">{points}</span>
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Rank: <span className={`font-semibold ${rankColor}`}>{rankLabel}</span>
              </p>
              <Link href="/rewards" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition">
                Tüm Ödülleri Gör
              </Link>
            </div>
          ) : list.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-12 text-center">
              <Gamepad2 size={36} className="text-gray-200 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-4">
                {tab === "purchased" ? "Henüz satın alma yok." : "Henüz oyun yok."}
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/games" className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-600 transition">
                  <ShoppingBag size={15} /> Oyun Satın Al
                </Link>
                <Link href="/redeem" className="inline-flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
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
