"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, Sun, Moon, User, LogOut, Shield } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function Header() {
  const { data: session } = useSession();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            <span className="font-bold text-xl text-gray-900">KadeStore</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition">
              Ana Sayfa
            </Link>
            <Link href="/games" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition">
              Oyunlar
            </Link>
            <Link href="/rewards" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition">
              Ödüller
            </Link>
            {session && (
              <>
                <Link href="/redeem" className="px-4 py-2 text-sm text-amber-600 hover:text-amber-700 rounded-lg hover:bg-amber-50 transition font-medium">
                  Kod Gir
                </Link>
                <Link href="/steam-guard" className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition font-medium">
                  Steam Guard
                </Link>
              </>
            )}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggle} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-24 truncate">{session.user?.name}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User size={15} /> Profilim
                    </Link>
                    {(session.user as any)?.role === "admin" && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-amber-600 hover:bg-amber-50">
                        <Shield size={15} /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={() => { signOut({ callbackUrl: "/" }); setUserMenuOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut size={15} /> Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition">
                  Giriş Yap
                </Link>
                <Link href="/register" className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition">
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <Link href="/" className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Ana Sayfa</Link>
          <Link href="/games" className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Oyunlar</Link>
          <Link href="/rewards" className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Ödüller</Link>
          {session ? (
            <>
              <Link href="/redeem" className="block px-3 py-2 text-sm text-amber-600 font-medium rounded-lg hover:bg-amber-50" onClick={() => setMenuOpen(false)}>🎮 Kod Gir</Link>
              <Link href="/steam-guard" className="block px-3 py-2 text-sm text-blue-600 font-medium rounded-lg hover:bg-blue-50" onClick={() => setMenuOpen(false)}>🛡️ Steam Guard</Link>
              <Link href="/profile" className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Profilim</Link>
              {(session.user as any)?.role === "admin" && (
                <Link href="/admin" className="block px-3 py-2 text-sm text-amber-600 rounded-lg hover:bg-amber-50" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
              )}
              <button onClick={() => signOut({ callbackUrl: "/" })} className="block w-full text-left px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50">Çıkış Yap</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(false)}>Giriş Yap</Link>
              <Link href="/register" className="block px-3 py-2 text-sm bg-amber-500 text-white rounded-lg text-center font-medium" onClick={() => setMenuOpen(false)}>Kayıt Ol</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
