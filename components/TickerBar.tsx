"use client";
import Link from "next/link";

interface Game {
  id: string;
  title: string;
  platform: string;
  imageUrl: string;
  slug?: string;
}

export default function TickerBar({ games }: { games: Game[] }) {
  if (!games.length) return null;
  const doubled = [...games, ...games];

  return (
    <div className="bg-black border-y border-white/5 py-2.5 overflow-hidden">
      <div className="flex items-center gap-4">
        <span className="flex-shrink-0 flex items-center gap-1.5 px-4 text-[11px] font-bold text-[#FFF785] uppercase tracking-[0.2em]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFF785] animate-pulse"></span>
          CANLI
        </span>
        <div className="overflow-hidden flex-1">
          <div className="flex gap-8 ticker-bar" style={{ width: "max-content" }}>
            {doubled.map((game, i) => (
              <div key={`${game.id}-${i}`} className="flex items-center gap-2 flex-shrink-0">
                <div className="w-6 h-6 rounded bg-white/5 overflow-hidden">
                  {game.imageUrl ? (
                    <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#FFF785] to-[#FFE74F]"></div>
                  )}
                </div>
                <span className="text-sm text-gray-200 whitespace-nowrap font-medium">{game.title}</span>
                <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-full uppercase tracking-wider">{game.platform}</span>
                <span className="text-[#FFF785]/40 ml-2">//</span>
              </div>
            ))}
          </div>
        </div>
        <Link href="/games" className="flex-shrink-0 px-4 text-xs text-[#FFF785] hover:text-[#FFF785] font-semibold whitespace-nowrap uppercase tracking-wider">
          Tümü &rsaquo;
        </Link>
      </div>
    </div>
  );
}
