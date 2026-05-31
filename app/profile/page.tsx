"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Key, Trophy, ShoppingBag, Gamepad2, Copy, Check, Shield, Plus } from "lucide-react";

const RANK_COLORS: Record<string, string> = {
  Bronze: "text-amber-600", Silver: "text-gray-500", Gold: "text-yellow-500",
  Platinum: "text-cyan-500", Diamond: "text-blue-500", Elite: "text-purple-500", none: "text-gray-400",
};

type Tab = "library" | "orders" | "rewards";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userKeys, setUserKeys] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("library");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/profile/library").then(r => r.json()),
      fetch("/api/users/me").then(r => r.json()),
    ]).then(([libData, meData]) => {
      setUserKeys(libData.library || []);
      setUserData(meData.user);
      setLoading(false);
    });
  }, [status]);

  function copyKey(id: string, key: string) {
    navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const purchased = userKeys.filter(k => k.source === "purchase");
  const redeemed = userKeys.filter(k => k.source === "redeem");
  const allGames = userKeys;

  const rankColor = RANK_COLORS[userData?.rank || "none"];
  const rankLabel = userData?.rank === "none" || !userData?.rank ? "Rütbesiz" : `KadeStore | ${userData.rank}`;

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Profil kartları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
                {session?.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 truncate">{session?.user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
                <span className={`text-xs font-semibold ${rankColor}`}>{rankLabel}</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={16} className="text-amber-500" />
                <p className="text-sm font-semibold text-gray-700">Puanlar</p>
              </div>
              <p className="text-3xl font-black text-amber-500">{userData?.points ?? 0}</p>
              <div className="h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(((userData?.points ?? 0) / 60) * 100, 100)}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{Math.max(60 - (userData?.points ?? 0), 0)} puan → Elite</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                <Gamepad2 size={16} className="text-amber-500" />
                <p className="text-sm font-semibold text-gray-700">Kütüphane</p>
              </div>
              <p className="text-3xl font-black text-gray-900">{allGames.length}</p>
              <p className="text-xs text-gray-400 mt-1">{purchased.length} satın alınan · {redeemed.length} aktivasyon</p>
            </div>
          </div>

          {/* Hızlı aksiyonlar */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Link href="/redeem" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
              <Key size={15} /> Kod Etkinleştir
            </Link>
            <Link href="/steam-guard" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
              <Shield size={15} /> Steam Guard
            </Link>
            <Link href="/rewards" className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
              <Trophy size={15} /> Ödüller
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
            {([
              { id: "library" as Tab, label: `Kütüphane (${allGames.length})` },
              { id: "orders" as Tab, label: `Satın Alınanlar (${purchased.length})` },
              { id: "rewards" as Tab, label: "Ödüller" },
            ]).map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Kütüphane */}
          {tab === "library" && (
            <div>
              {allGames.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                  <Gamepad2 size={36} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm mb-4">Henüz oyun yok.</p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/games" className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-600 transition">
                      <Plus size={15} /> Oyun Satın Al
                    </Link>
                    <Link href="/redeem" className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition">
                      <Key size={15} /> Kod Gir
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allGames.map((uk: any) => (
                    <div key={uk.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
                      <div className="h-28 bg-gradient-to-br from-amber-400 to-orange-500 relative">
                        {uk.gameKey?.game?.imageUrl && (
                          <img src={uk.gameKey.game.imageUrl} alt={uk.gameKey.game.title} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute top-2 right-2 flex gap-1">
                          <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">{uk.gameKey?.game?.platform}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${uk.source === "purchase" ? "bg-amber-500 text-white" : "bg-blue-500 text-white"}`}>
                            {uk.source === "purchase" ? "Satın Alındı" : "Aktivasyon"}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="font-semibold text-gray-900 text-sm truncate">{uk.gameKey?.game?.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{uk.gameKey?.game?.genre}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <p className="font-mono text-xs text-gray-500 flex-1 truncate">{uk.gameKey?.key}</p>
                          <button
                            onClick={() => copyKey(uk.id, uk.gameKey?.key)}
                            className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition flex-shrink-0"
                          >
                            {copied === uk.id ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-300 mt-1">{new Date(uk.claimedAt).toLocaleDateString("tr-TR")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Satın Alınanlar */}
          {tab === "orders" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              {purchased.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag size={32} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Satın alma yok.</p>
                  <Link href="/games" className="text-amber-500 hover:underline text-sm mt-2 inline-block">Oyunlara göz at →</Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {purchased.map((uk: any) => (
                    <div key={uk.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Gamepad2 size={18} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{uk.gameKey?.game?.title}</p>
                          <p className="text-xs text-gray-400">{new Date(uk.claimedAt).toLocaleDateString("tr-TR")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-xs text-gray-500">{uk.gameKey?.key}</p>
                        <button onClick={() => copyKey(uk.id, uk.gameKey?.key)} className="p-1.5 text-gray-400 hover:text-amber-500 rounded-lg">
                          {copied === uk.id ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Ödüller */}
          {tab === "rewards" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <Trophy size={32} className="text-amber-500 mx-auto mb-3" />
              <p className="text-gray-700 font-semibold mb-1">Mevcut Puanınız: <span className="text-amber-500">{userData?.points ?? 0}</span></p>
              <p className="text-sm text-gray-400 mb-4">Rank: <span className={`font-semibold ${rankColor}`}>{rankLabel}</span></p>
              <Link href="/rewards" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition">
                Tüm Ödülleri Gör
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
