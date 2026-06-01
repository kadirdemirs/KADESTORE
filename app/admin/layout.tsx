import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Gamepad2, Key, Users, ShoppingBag, Home, Package, BarChart3, Tag, UserCog } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") redirect("/");

  const navItems = [
    { href: "/admin", label: "Panel", icon: LayoutDashboard },
    { href: "/admin/analytics", label: "Analitik", icon: BarChart3 },
    { href: "/admin/games", label: "Oyunlar", icon: Gamepad2 },
    { href: "/admin/keys", label: "Anahtarlar", icon: Key },
    { href: "/admin/accounts", label: "Hesap Stoğu", icon: UserCog },
    { href: "/admin/stock", label: "Stok Kontrolü", icon: Package },
    { href: "/admin/coupons", label: "Kuponlar", icon: Tag },
    { href: "/admin/users", label: "Kullanıcılar", icon: Users },
    { href: "/admin/orders", label: "Siparişler", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-[#0a0a0a] border-r border-white/5 flex flex-col py-6">
        <div className="px-5 mb-8">
          <div className="flex items-center gap-2">
            <Gamepad2 size={18} className="text-[#FFF785]" />
            <span className="font-display font-black text-white text-base tracking-tight">kadestore</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-[0.2em]">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-3 mt-4 space-y-1 border-t border-white/5 pt-4">
          <Link href="/" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition">
            <Home size={16} /> Siteye Dön
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-[#0a0a0a] min-h-screen text-gray-100">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
