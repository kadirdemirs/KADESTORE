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
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-100">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 red-glow opacity-40" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#FFF785]/10 blur-[100px]" />

        <div className="relative max-w-3xl mx-auto">
          <div className="mb-10">
            <span className="inline-block bg-[#FFF785]/10 text-[#FFF785] text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-[#FFF785]/20">
              <Trophy size={12} className="inline -mt-0.5 mr-1" /> Ödüller
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight">Rank ve hediye anahtarları</h1>
            <p className="text-gray-400 mt-3 max-w-2xl">
              Puanınız, kullandığınız anahtarlarda seçtiğiniz oyunlarla artar. Kademe ödülleri aşağıda listelenir;
              anahtarı kopyalayıp{" "}
              <Link href="/verify" className="text-[#FFF785] hover:text-[#FFF785]">Doğrula</Link> sayfasında kullanırsınız.
            </p>
          </div>

          {session && (
            <div className="bg-[#111111] rounded-3xl border border-white/5 shadow-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Toplam Puanınız</p>
                <p className="font-display text-3xl font-black text-[#FFF785]">{userPoints}</p>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FFF785] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((userPoints / 60) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Mevcut rank:{" "}
                <span className="text-[#FFF785] font-semibold">
                  {(() => {
                    const r = userRank && userRank !== "none" ? userRank : rankFromPoints(userPoints);
                    return r === "none" ? "Rütbesiz" : `KadeStore | ${r}`;
                  })()}
                </span>
              </p>
            </div>
          )}

          <div>
            <h2 className="font-display text-2xl font-bold text-white mb-5">Kademeler</h2>
            <div className="space-y-3">
              {RANKS.map((rank) => {
                const unlocked = session && userPoints >= rank.required;
                const progress = session ? Math.min((userPoints / rank.required) * 100, 100) : 0;

                return (
                  <div
                    key={rank.name}
                    className={`bg-[#111111] rounded-2xl border p-5 transition ${
                      unlocked ? "border-[#FFF785]/30 shadow-[0_15px_50px_-20px_rgba(255,247,133,0.4)]" : "border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${unlocked ? "bg-[#FFF785]/15 border border-[#FFF785]/20" : "bg-white/5 border border-white/10"}`}>
                        {unlocked ? (
                          <Trophy size={20} className="text-[#FFF785]" />
                        ) : (
                          <Lock size={18} className="text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-display font-bold ${unlocked ? "text-white" : "text-gray-500"}`}>
                          KadeStore | {rank.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {rank.required} oyun seçimi · +{rank.bonus} hediye anahtar
                        </p>
                      </div>
                      {unlocked && (
                        <span className="text-[10px] uppercase tracking-wider bg-[#FFF785]/15 border border-[#FFF785]/20 text-[#FFF785] px-2.5 py-1 rounded-full font-semibold">Kazanıldı</span>
                      )}
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${unlocked ? "bg-[#FFF785]" : "bg-white/10"}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {!session && (
            <div className="text-center mt-10 py-6 bg-[#111111] border border-white/5 rounded-2xl">
              <Link href="/login" className="text-[#FFF785] hover:text-[#FFF785] font-semibold">
                Giriş yapın
              </Link>{" "}
              <span className="text-gray-400">— ilerlemenizi ve anahtarlarınızı görün.</span>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
