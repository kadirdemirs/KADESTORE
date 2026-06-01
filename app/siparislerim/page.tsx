"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ShoppingBag, CheckCircle, XCircle, Clock, Gamepad2 } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  pending: "bg-[#FFF785]/10 text-[#FFF785] border-[#FFF785]/30",
  failed: "bg-red-500/10 text-red-400 border-red-500/30",
  no_stock: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  cancelled: "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

const STATUS_LABELS: Record<string, string> = {
  completed: "Tamamlandı",
  pending: "Bekliyor",
  failed: "Başarısız",
  no_stock: "Stok Tükendi",
  cancelled: "İptal Edildi",
};

const STATUS_ICONS: Record<string, any> = {
  completed: CheckCircle,
  pending: Clock,
  failed: XCircle,
  no_stock: XCircle,
  cancelled: XCircle,
};

export default function SiparislerimPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?redirect=/siparislerim");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/orders?mine=1")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-100">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 red-glow opacity-30" />

        <div className="relative max-w-4xl mx-auto">
          <span className="inline-block bg-[#FFF785]/10 text-[#FFF785] text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-[#FFF785]/20">
            <ShoppingBag size={12} className="inline -mt-0.5 mr-1" /> Siparişler
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Siparişlerim
          </h1>
          <p className="text-gray-400 mb-8">{orders.length} sipariş</p>

          {loading ? (
            <p className="text-gray-500">Yükleniyor...</p>
          ) : orders.length === 0 ? (
            <div className="bg-[#111111] border border-white/5 rounded-3xl p-14 text-center">
              <ShoppingBag size={40} className="text-white/10 mx-auto mb-4" />
              <p className="text-gray-300 text-base font-semibold mb-1">Henüz siparişiniz yok.</p>
              <Link
                href="/games"
                className="inline-flex items-center gap-2 mt-3 bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] px-5 py-2.5 rounded-full text-sm font-semibold transition"
              >
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => {
                const StatusIcon = STATUS_ICONS[o.status] || Clock;
                return (
                  <div key={o.id} className="bg-[#111111] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFE74F]/30 to-[#0a0a0a] flex items-center justify-center flex-shrink-0">
                      <Gamepad2 size={20} className="text-white/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{o.game.title}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
                        Sipariş #{o.id.slice(-8).toUpperCase()} · {new Date(o.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                      {o.userKey?.gameKey?.key && (
                        <p className="text-xs font-mono text-emerald-400 mt-1 truncate">
                          {o.userKey.gameKey.key}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-display text-lg font-black text-[#FFF785]">₺{o.price.toFixed(2)}</p>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 ${STATUS_COLORS[o.status] || ""}`}>
                        <StatusIcon size={10} /> {STATUS_LABELS[o.status] || o.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
