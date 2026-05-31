import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RANKS, rankFromPoints } from "@/lib/utils";
import Link from "next/link";
import { Trophy, Lock } from "lucide-react";

export default async function RewardsPage() {
  const session = await getServerSession(authOptions);
  let userPoints = 0;
  let userRank = "none";

  if (session?.user) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { points: true, rank: true },
    });
    if (user) {
      userPoints = user.points;
      userRank = user.rank;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider mb-2">
              <Trophy size={16} /> ÖDÜLLER
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Rank ve hediye anahtarları</h1>
            <p className="text-gray-500 mt-2">
              Puanınız, kullandığınız anahtarlarda seçtiğiniz oyunlarla artar. Kademe ödülleri aşağıda listelenir;
              anahtarı kopyalayıp{" "}
              <Link href="/verify" className="text-amber-500 hover:underline">Doğrula</Link> sayfasında kullanırsınız.
            </p>
          </div>

          {/* Progress (logged in) */}
          {session && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700">Toplam Puanınız</p>
                <p className="text-2xl font-black text-amber-500">{userPoints}</p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((userPoints / 60) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Mevcut rank:{" "}
                <span className="text-amber-500 font-semibold">
                  {(() => {
                    const r = userRank && userRank !== "none" ? userRank : rankFromPoints(userPoints);
                    return r === "none" ? "Rütbesiz" : `KadeStore | ${r}`;
                  })()}
                </span>
              </p>
            </div>
          )}

          {/* Ranks */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Kademeler</h2>
            <div className="space-y-3">
              {RANKS.map((rank) => {
                const unlocked = session && userPoints >= rank.required;
                const progress = session ? Math.min((userPoints / rank.required) * 100, 100) : 0;

                return (
                  <div
                    key={rank.name}
                    className={`bg-white rounded-2xl border p-5 transition ${
                      unlocked ? "border-amber-200 shadow-sm" : "border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${unlocked ? "bg-amber-100" : "bg-gray-100"}`}>
                        {unlocked ? (
                          <Trophy size={20} className="text-amber-500" />
                        ) : (
                          <Lock size={20} className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className={`font-semibold ${unlocked ? "text-gray-900" : "text-gray-500"}`}>
                          KadeStore | {rank.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {rank.required} oyun seçimi gerekli · +{rank.bonus} hediye anahtar
                        </p>
                      </div>
                      {unlocked && (
                        <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Kazanıldı</span>
                      )}
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${unlocked ? "bg-amber-500" : "bg-gray-200"}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {!session && (
            <div className="text-center mt-8 py-4">
              <Link href="/login" className="text-amber-500 hover:text-amber-600 font-semibold">
                Giriş yapın
              </Link>{" "}
              <span className="text-gray-500">— ilerlemenizi ve anahtarlarınızı görün.</span>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
