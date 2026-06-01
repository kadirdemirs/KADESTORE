"use client";
import Link from "next/link";
import { Gamepad2, Zap, ShoppingCart, Check } from "lucide-react";
import { useCart } from "./CartProvider";

interface GameCardProps {
  game: {
    id: string;
    slug: string;
    title: string;
    platform: string;
    genre: string;
    price: number;
    imageUrl: string;
    isFeatured?: boolean;
    _count?: { keys: number };
  };
}

// itemsatis tarzı: 3:4 görsel, kompakt info, vurgulu fiyat, hover'da sepete ekle CTA
export default function GameCard({ game }: GameCardProps) {
  const stock = game._count?.keys;
  const inStock = stock === undefined || stock > 0;
  const { add, isInCart } = useCart();
  const inCart = isInCart(game.id);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock || inCart) return;
    add({
      gameId: game.id,
      slug: game.slug,
      title: game.title,
      price: game.price,
      imageUrl: game.imageUrl,
      platform: game.platform,
    });
  }

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group relative flex flex-col bg-[#111111] border border-white/5 rounded-2xl overflow-hidden hover:border-[#FFF785]/40 transition shadow-2xl"
    >
      <div className="relative aspect-[3/4] bg-gradient-to-br from-[#FFE74F]/20 via-[#1a1a1a] to-[#0a0a0a] overflow-hidden">
        {game.imageUrl ? (
          <img
            src={game.imageUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Gamepad2 size={40} className="text-white/10" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

        <span className="absolute top-2 left-2 bg-black/80 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
          {game.platform}
        </span>

        {game.isFeatured && (
          <span className="absolute top-2 right-2 bg-[#FFF785] text-[#0a0a0a] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            Öne Çıkan
          </span>
        )}

        {!inStock && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center">
            <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Stokta Yok
            </span>
          </div>
        )}

        {inStock && (
          <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition duration-300">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={inCart}
              className={`w-full text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-lg transition ${
                inCart
                  ? "bg-emerald-500 text-white"
                  : "bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a]"
              }`}
            >
              {inCart ? (
                <>
                  <Check size={13} /> Sepete Eklendi
                </>
              ) : (
                <>
                  <ShoppingCart size={13} /> Sepete Ekle
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 truncate">{game.genre}</p>
        <p className="text-sm font-semibold text-white leading-tight line-clamp-2 mb-2 min-h-[2.5em]">
          {game.title}
        </p>

        <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[9px] text-gray-500 uppercase tracking-wider leading-none">Fiyat</p>
            <p className="font-display text-lg font-black text-[#FFF785] leading-tight">
              ₺{game.price.toFixed(2)}
            </p>
          </div>
          {inStock && (
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold flex-shrink-0">
              <Zap size={11} className="fill-emerald-400" />
              Anında
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
