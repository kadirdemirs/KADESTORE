import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Gamepad2, Key, Users, ShoppingBag, Home, Package, BarChart3, Tag, RefreshCw, Mail } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") redirect("/");

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/games", label: "Oyunlar", icon: Gamepad2 },
    { href: "/admin/keys", label: "Anahtarlar", icon: Key },
    { href: "/admin/stock", label: "Stok Kontrolü", icon: Package },
    { href: "/admin/coupons", label: "Kuponlar", icon: Tag },
    { href: "/admin/users", label: "Kullanıcılar", icon: Users },
    { href: "/admin/orders", label: "Siparişler", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen flex bg-gray-950">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-gray-900 flex flex-col py-6">
        <div className="px-5 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="font-bold text-white text-sm">KadeStore</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-3 mt-4 space-y-1 border-t border-gray-800 pt-4">
          <Link href="/" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition">
            <Home size={16} /> Siteye Dön
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-gray-50 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
