"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, CreditCard, Key, Shield, Zap, Tag, X, CheckCircle2 } from "lucide-react";

export default function GameDetailClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState("");
  const [keyAvail, setKeyAvail] = useState(false);
  const [similar, setSimilar] = useState<any[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const [shopierForm, setShopierForm] = useState<{ actionUrl: string; fields: Record<string, string> } | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    fetch(`/api/games?slug=${slug}`).then(r => r.json()).then(data => {
      if (data.game) { setGame(data.game); setKeyAvail(data.keyCount > 0); }
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (game?.genre) {
      fetch(`/api/games?genre=${game.genre}`).then(r => r.json()).then(data => {
        setSimilar((data.games || []).filter((g: any) => g.id !== game.id).slice(0, 4));
      });
    }
  }, [game]);

  useEffect(() => { if (shopierForm && formRef.current) formRef.current.submit(); }, [shopierForm]);

  async function checkCoupon() {
    if (!couponCode.trim()) return;
    setCouponLoading(true); setCouponError(""); setCouponResult(null);
    const res = await fetch("/api/coupons/check", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, price: game?.price }),
    });
    const data = await res.json();
    if (res.ok) setCouponResult(data);
    else setCouponError(data.error || "Kupon geçersiz.");
    setCouponLoading(false);
  }

  async function handleBuy() {
    if (!session) { router.push("/login"); return; }
    setPaying(true); setMessage("");
    const res = await fetch("/api/payment/start", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: game.id, couponCode: couponResult?.code }),
    });
    const data = await res.json();
    if (res.ok && data.actionUrl) {
      setMessage("Shopier ödeme sayfasına yönlendiriliyorsunuz...");
      setShopierForm(data);
    } else {
      setMessage(`❌ ${data.error || "Bir hata oluştu."}`);
      setPaying(false);
    }
  }

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#FFF785] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!game) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-500">
      <p>Oyun bulunamadı.</p>
      <Link href="/games" className="text-[#FFF785] hover:underline">← Oyunlara dön</Link>
    </div>
  );

  const finalPrice = couponResult?.finalPrice ?? game.price;

  return (
    <main className="flex-1 bg-[#0a0a0a] dark:bg-gray-950 py-10 px-4">
      {shopierForm && (
        <form ref={formRef} method="POST" action={shopierForm.actionUrl} style={{ display: "none" }}>
          {Object.entries(shopierForm.fields).map(([n, v]) => <input key={n} type="hidden" name={n} value={v} />)}
        </form>
      )}
      <div className="max-w-5xl mx-auto">
        <Link href="/games" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500 hover:text-gray-200 dark:hover:text-gray-200 mb-6">
          <ArrowLeft size={16} /> Oyunlara dön
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Oyun bilgisi */}
          <div className="lg:col-span-2">
            <div className="bg-[#111111] dark:bg-gray-900 rounded-2xl overflow-hidden border border-white/5 dark:border-gray-800 shadow-2xl">
              <div className="h-64 bg-gradient-to-br from-[#FFF785] to-[#FFF785] relative">
                {game.imageUrl && <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover" />}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-black/60 text-white text-sm px-3 py-1 rounded-full">{game.platform}</span>
                  <span className="bg-white/5/90 text-gray-200 text-sm px-3 py-1 rounded-full">{game.genre}</span>
                </div>
              </div>
              <div className="p-6">
                <h1 className="text-2xl font-bold text-white dark:text-white mb-3">{game.title}</h1>
                <p className="text-gray-600 dark:text-gray-500 text-sm leading-relaxed">{game.description}</p>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { icon: Zap, label: "Anında Teslimat", color: "text-[#FFF785] bg-[#FFF785]/10 dark:bg-[#FFE74F]/20" },
                    { icon: Shield, label: "Güvenli Ödeme", color: "text-green-500 bg-green-50 dark:bg-green-900/20" },
                    { icon: Key, label: "Orijinal Lisans", color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20" },
                  ].map(({ icon: Icon, label, color }) => (
                    <div key={label} className={`${color} rounded-xl p-3 text-center`}>
                      <Icon size={18} className="mx-auto mb-1" />
                      <p className="text-xs text-gray-600 dark:text-gray-600 font-medium">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Satın alma */}
          <div className="space-y-4">
            <div className="bg-[#111111] dark:bg-gray-900 rounded-2xl border border-white/5 dark:border-gray-800 shadow-2xl p-6">
              {couponResult ? (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-500 line-through">₺{game.price.toFixed(2)}</span>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                      -{couponResult.type === "percent" ? `%${couponResult.value}` : `₺${couponResult.discount}`}
                    </span>
                  </div>
                  <p className="text-3xl font-black text-[#FFF785] mb-1">₺{finalPrice.toFixed(2)}</p>
                </div>
              ) : (
                <p className="text-3xl font-black text-[#FFF785] mb-1">₺{game.price.toFixed(2)}</p>
              )}
              <p className="text-xs text-gray-500 mb-4">KDV dahil · Anında teslimat</p>

              {/* Kupon */}
              {session && (
                <div className="mb-4">
                  {couponResult ? (
                    <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-2.5">
                      <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />
                      <span className="text-xs text-green-700 dark:text-green-400 font-medium flex-1">{couponResult.code} uygulandı</span>
                      <button onClick={() => { setCouponResult(null); setCouponCode(""); }} className="text-green-600 hover:text-green-800">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Kupon kodu"
                        className="flex-1 border border-white/10 dark:border-gray-700 bg-[#111111] dark:bg-gray-800 text-white dark:text-white rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#FFF785] uppercase" />
                      <button onClick={checkCoupon} disabled={couponLoading || !couponCode.trim()}
                        className="px-3 py-2 bg-white/5 dark:bg-gray-700 text-gray-200 dark:text-gray-200 rounded-xl text-xs font-medium hover:bg-white/10 dark:hover:bg-gray-600 transition disabled:opacity-50">
                        <Tag size={14} />
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-[#FFF785] text-xs mt-1">{couponError}</p>}
                </div>
              )}

              {message && (
                <div className={`p-3 rounded-xl text-sm mb-4 ${message.startsWith("❌") ? "bg-[#FFF785]/10 dark:bg-[#FFE74F]/20 text-[#FFE74F] dark:text-[#FFF785]" : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"}`}>
                  {!message.startsWith("❌") && <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />{message}</div>}
                  {message.startsWith("❌") && message}
                </div>
              )}

              <button onClick={handleBuy} disabled={paying || !keyAvail}
                className="w-full bg-[#FFF785] hover:bg-[#FFF785] disabled:opacity-50 text-[#0a0a0a] py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 mb-3">
                <CreditCard size={18} />
                {paying ? "Yönlendiriliyor..." : !keyAvail ? "Stokta Yok" : `₺${finalPrice.toFixed(2)} Öde`}
              </button>

              {!session && <p className="text-xs text-center text-gray-500 mb-3">Satın almak için <Link href="/login" className="text-[#FFF785] hover:underline">giriş yapın</Link></p>}

              <div className="border-t border-white/5 dark:border-gray-800 pt-3 text-center">
                <p className="text-xs text-gray-500 mb-1.5">Güvenli ödeme</p>
                <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
                  shopier · 3D Secure
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <span className={`w-1.5 h-1.5 rounded-full ${keyAvail ? "bg-green-500" : "bg-[#FFF785]"}`}></span>
                  {keyAvail ? "Stokta mevcut" : "Stokta yok"}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Ödeme sonrası anahtar e-posta ile gönderilir
                </div>
              </div>
            </div>

            <div className="bg-[#FFF785]/10 dark:bg-[#FFE74F]/20 border border-[#FFF785]/15 dark:border-[#FFE74F] rounded-2xl p-4">
              <p className="text-sm font-semibold text-[#FFE74F] dark:text-[#FFF785] mb-1">💡 Anahtar Doğrulama</p>
              <p className="text-xs text-[#FFE74F] dark:text-[#FFF785]">
                Aldığınız anahtarı <Link href="/verify" className="underline">Doğrulama</Link> sayfasında kontrol edin.
              </p>
            </div>
          </div>
        </div>

        {/* Benzer Oyunlar */}
        {similar.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white dark:text-white mb-4">Benzer Oyunlar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similar.map(g => (
                <Link key={g.id} href={`/games/${g.slug}`}
                  className="group bg-[#111111] dark:bg-gray-900 border border-white/5 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-md transition hover:border-[#FFF785]/30 dark:hover:border-[#FFE74F]">
                  <div className="h-28 bg-gradient-to-br from-[#FFF785] to-[#FFF785] overflow-hidden relative">
                    {g.imageUrl && <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />}
                    <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">{g.platform}</span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-white dark:text-white truncate">{g.title}</p>
                    <p className="text-[#FFF785] font-bold text-sm mt-0.5">₺{g.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
