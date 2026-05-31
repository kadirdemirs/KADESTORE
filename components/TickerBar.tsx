"use client";

interface Game {
  id: string;
  title: string;
  platform: string;
  imageUrl: string;
}

export default function TickerBar({ games }: { games: Game[] }) {
  if (!games.length) return null;
  const doubled = [...games, ...games];

  return (
    <div className="bg-white border-b border-gray-100 py-2 overflow-hidden">
      <div className="flex items-center gap-4">
        <span className="flex-shrink-0 flex items-center gap-1.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          YENİ EKLENENLER
        </span>
        <div className="overflow-hidden flex-1">
          <div className="flex gap-6 ticker-bar" style={{ width: "max-content" }}>
            {doubled.map((game, i) => (
              <div key={`${game.id}-${i}`} className="flex items-center gap-2 flex-shrink-0">
                <div className="w-6 h-6 rounded bg-gray-200 overflow-hidden">
                  {game.imageUrl ? (
                    <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500"></div>
                  )}
                </div>
                <span className="text-sm text-gray-700 whitespace-nowrap">{game.title}</span>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{game.platform}</span>
              </div>
            ))}
          </div>
        </div>
        <a href="/games" className="flex-shrink-0 px-4 text-xs text-amber-500 hover:text-amber-600 font-medium whitespace-nowrap">
          Tümü &rsaquo;
        </a>
      </div>
    </div>
  );
}
