"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, User, LogOut, Shield, Globe, ArrowUpRight, Gamepad2, ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";

export default function Header() {
  const { data: session } = useSession();
  const { count: cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 inset-x-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <div className="relative flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-white">
            <Gamepad2 size={20} className="text-[#FFF785]" />
            <span className="font-display font-black text-xl tracking-tight">kadestore</span>
          </Link>

          {/* Center Pill Nav — gerçek viewport ortasına sabitlenmiş */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-2 py-1.5 shadow-2xl">
            <Link href="/" className="px-4 py-1.5 text-sm text-white hover:text-[#FFF785] transition rounded-full">
              Ana Sayfa
            </Link>
            <Link href="/games" className="px-4 py-1.5 text-sm text-gray-300 hover:text-white transition rounded-full">
              Oyunlar
            </Link>
            <Link href="/rewards" className="px-4 py-1.5 text-sm text-gray-300 hover:text-white transition rounded-full">
              Ödüller
            </Link>
            {session && (
              <>
                <Link href="/guard" className="px-4 py-1.5 text-sm text-gray-300 hover:text-white transition rounded-full">
                  Guard
                </Link>
                <Link href="/verify" className="px-4 py-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition rounded-full">
                  Doğrula
                </Link>
              </>
            )}
            <span className="w-px h-4 bg-white/10 mx-1" />
            <button className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition rounded-full flex items-center gap-1.5">
              <Globe size={13} /> TR
            </button>
          </nav>

          {/* Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/sepet"
              aria-label="Sepet"
              className="relative p-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-white hover:border-[#FFF785]/40 transition"
            >
              <ShoppingCart size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#FFF785] text-[#0a0a0a] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full pl-1.5 pr-4 py-1.5 text-sm text-white hover:border-[#FFF785]/40 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-[#FFF785] flex items-center justify-center text-[#0a0a0a] text-xs font-bold">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-24 truncate">{session.user?.name}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#111111] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn">
                    <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-white/5">
                      <User size={15} /> Profilim
                    </Link>
                    <Link href="/redeem" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-white/5">
                      <Gamepad2 size={15} /> Kod Gir
                    </Link>
                    {(session.user as any)?.role === "admin" && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#FFF785] hover:bg-[#FFF785]/10">
                        <Shield size={15} /> Admin Panel
                      </Link>
                    )}
                    <div className="h-px bg-white/10 my-1" />
                    <button
                      onClick={() => { signOut({ callbackUrl: "/" }); setUserMenuOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#FFF785] hover:bg-[#FFF785]/10 w-full text-left"
                    >
                      <LogOut size={15} /> Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-sm text-gray-300 hover:text-white transition px-2">
                Giriş Yap
              </Link>
            )}
            <Link
              href="/games"
              className="group inline-flex items-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] px-5 py-2.5 rounded-full text-sm font-semibold transition shadow-[0_10px_30px_-10px_rgba(255,247,133,0.6)]"
            >
              Alışverişe Başla
              <span className="w-5 h-5 rounded-full bg-[#0a0a0a]/15 flex items-center justify-center group-hover:bg-[#0a0a0a]/30 transition">
                <ArrowUpRight size={12} />
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white bg-black/60 backdrop-blur-xl border border-white/10 rounded-full"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mx-4 mt-2 bg-[#111111]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 space-y-1 animate-fadeIn">
          <Link href="/" className="block px-3 py-2 text-sm text-white rounded-lg hover:bg-white/5" onClick={() => setMenuOpen(false)}>Ana Sayfa</Link>
          <Link href="/games" className="block px-3 py-2 text-sm text-gray-200 rounded-lg hover:bg-white/5" onClick={() => setMenuOpen(false)}>Oyunlar</Link>
          <Link href="/rewards" className="block px-3 py-2 text-sm text-gray-200 rounded-lg hover:bg-white/5" onClick={() => setMenuOpen(false)}>Ödüller</Link>
          {session ? (
            <>
              <Link href="/redeem" className="block px-3 py-2 text-sm text-[#FFF785] rounded-lg hover:bg-[#FFF785]/10" onClick={() => setMenuOpen(false)}>Kod Gir</Link>
              <Link href="/guard" className="block px-3 py-2 text-sm text-[#FFF785] rounded-lg hover:bg-[#FFF785]/10" onClick={() => setMenuOpen(false)}>Guard</Link>
              <Link href="/verify" className="block px-3 py-2 text-sm text-emerald-400 rounded-lg hover:bg-emerald-500/10" onClick={() => setMenuOpen(false)}>Doğrula</Link>
              <Link href="/profile" className="block px-3 py-2 text-sm text-gray-200 rounded-lg hover:bg-white/5" onClick={() => setMenuOpen(false)}>Profilim</Link>
              {(session.user as any)?.role === "admin" && (
                <Link href="/admin" className="block px-3 py-2 text-sm text-[#FFF785] rounded-lg hover:bg-[#FFF785]/10" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
              )}
              <button onClick={() => signOut({ callbackUrl: "/" })} className="block w-full text-left px-3 py-2 text-sm text-[#FFF785] rounded-lg hover:bg-[#FFF785]/10">Çıkış Yap</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block px-3 py-2 text-sm text-gray-200 rounded-lg hover:bg-white/5" onClick={() => setMenuOpen(false)}>Giriş Yap</Link>
              <Link href="/register" className="block px-3 py-2 text-sm bg-[#FFF785] text-[#0a0a0a] rounded-lg text-center font-medium" onClick={() => setMenuOpen(false)}>Kayıt Ol</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
