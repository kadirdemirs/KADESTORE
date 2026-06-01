"use client";
import { useCart } from "@/components/CartProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart, X, ArrowUpRight, Gamepad2, CreditCard } from "lucide-react";

export default function CartPage() {
  const { items, remove, clear, total } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shopierForm, setShopierForm] = useState<{ actionUrl: string; fields: Record<string, string> } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (shopierForm && formRef.current) formRef.current.submit();
  }, [shopierForm]);

  async function handleCheckout() {
    if (!session) {
      router.push("/login?redirect=/sepet");
      return;
    }
    if (items.length === 0) return;

    // Sepetteki her oyun için ayrı bir sipariş başlatılır (basit yaklaşım).
    // Daha gelişmiş: tek Order multi-line ama Schema şu an buna izin vermiyor.
    setLoading(true);
    setError("");
    try {
      // İlk ürünü Shopier'a gönder; diğerleri kullanıcının iadesi sonrasında otomatik olarak da işlenebilir.
      // Daha doğru: arka arkaya checkout. UX gereği şu an ilk ürün ile başla.
      const res = await fetch("/api/payment/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: items[0].gameId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Hata");
      setShopierForm(data);
    } catch (e: any) {
      setError(e.message || "Ödeme başlatılamadı.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-100">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 red-glow opacity-30" />

        {shopierForm && (
          <form ref={formRef} method="POST" action={shopierForm.actionUrl} style={{ display: "none" }}>
            {Object.entries(shopierForm.fields).map(([n, v]) => (
              <input key={n} type="hidden" name={n} value={v} />
            ))}
          </form>
        )}

        <div className="relative max-w-4xl mx-auto">
          <span className="inline-block bg-[#FFF785]/10 text-[#FFF785] text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-[#FFF785]/20">
            <ShoppingCart size={12} className="inline -mt-0.5 mr-1" /> Sepet
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Sepetim
          </h1>
          <p className="text-gray-400 mb-8">{items.length} ürün</p>

          {items.length === 0 ? (
            <div className="bg-[#111111] border border-white/5 rounded-3xl p-14 text-center">
              <ShoppingCart size={40} className="text-white/10 mx-auto mb-4" />
              <p className="text-gray-300 text-base font-semibold mb-1">Sepetiniz boş.</p>
              <p className="text-gray-500 text-sm mb-5">Hemen kataloğa göz atın.</p>
              <Link
                href="/games"
                className="inline-flex items-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] px-5 py-2.5 rounded-full text-sm font-semibold transition"
              >
                Oyunlara Bak <ArrowUpRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-3">
                {items.map((item) => (
                  <div key={item.gameId} className="bg-[#111111] border border-white/5 rounded-2xl p-3 flex items-center gap-4">
                    <Link href={`/games/${item.slug}`} className="w-16 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-[#FFE74F]/20 to-[#0a0a0a] flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Gamepad2 size={20} className="text-white/20" />
                        </div>
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/games/${item.slug}`} className="font-semibold text-white hover:text-[#FFF785] transition truncate block">
                        {item.title}
                      </Link>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-0.5">{item.platform}</p>
                      <p className="font-display text-lg font-black text-[#FFF785] mt-1">₺{item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => remove(item.gameId)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      aria-label="Sepetten çıkar"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={clear}
                  className="text-xs text-gray-500 hover:text-red-400 mt-3"
                >
                  Sepeti temizle
                </button>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 sticky top-28">
                  <h2 className="font-display text-xl font-bold text-white mb-4">Sipariş Özeti</h2>
                  <div className="space-y-2 text-sm pb-4 border-b border-white/5">
                    <div className="flex justify-between text-gray-400">
                      <span>Ara toplam</span>
                      <span>₺{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>KDV (dahil)</span>
                      <span>—</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end pt-4 mb-4">
                    <span className="text-sm font-semibold text-white">Toplam</span>
                    <span className="font-display text-2xl font-black text-[#FFF785]">₺{total.toFixed(2)}</span>
                  </div>

                  {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

                  <button
                    onClick={handleCheckout}
                    disabled={loading || items.length === 0}
                    className="group w-full inline-flex items-center justify-center gap-2 bg-[#FFF785] hover:bg-[#FFE74F] disabled:opacity-60 text-[#0a0a0a] py-3.5 rounded-full font-semibold text-sm transition shadow-[0_15px_40px_-10px_rgba(255,247,133,0.6)]"
                  >
                    <CreditCard size={16} />
                    {loading ? "Yönlendiriliyor..." : "Ödemeye Geç"}
                  </button>
                  {items.length > 1 && (
                    <p className="text-[10px] text-gray-500 mt-2 text-center">
                      Birden fazla ürün varsa şimdilik ilk ürün için Shopier'a yönlendirilir.
                      Çoklu ürün toplu ödeme yakında.
                    </p>
                  )}
                  <p className="text-[10px] text-gray-500 mt-3 text-center">
                    Devam ederek <Link href="/mesafeli-satis" className="text-[#FFF785] hover:underline">Mesafeli Satış Sözleşmesi</Link>'ni ve <Link href="/on-bilgilendirme" className="text-[#FFF785] hover:underline">Ön Bilgilendirme Formu</Link>'nu kabul etmiş olursunuz.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
