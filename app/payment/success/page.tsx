"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Copy, Key, ArrowRight } from "lucide-react";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    // Sipariş tamamlanana kadar polling yap (callback gecikmeli gelebilir)
    let tries = 0;
    const poll = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.order?.status === "completed" || tries >= 10) {
          setOrder(data.order);
          setLoading(false);
        } else {
          tries++;
          setTimeout(poll, 2000);
        }
      } catch {
        setLoading(false);
      }
    };
    poll();
  }, [orderId]);

  function copyKey() {
    const key = order?.userKey?.gameKey?.key;
    if (key) {
      navigator.clipboard.writeText(key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Ödeme Başarılı!</h1>
      <p className="text-gray-500 mb-8">Siparişiniz tamamlandı. Oyun anahtarınız aşağıda.</p>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Anahtarınız hazırlanıyor...</p>
        </div>
      ) : order ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
          <p className="text-sm text-gray-500 mb-2">{order.game?.title}</p>
          {order.userKey?.gameKey?.key ? (
            <>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Key size={16} className="text-amber-500" />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Oyun Anahtarınız</p>
                </div>
                <p className="font-mono text-lg font-bold text-gray-900 tracking-wider">
                  {order.userKey.gameKey.key}
                </p>
              </div>
              <button
                onClick={copyKey}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition w-full justify-center"
              >
                <Copy size={16} />
                {copied ? "Kopyalandı!" : "Anahtarı Kopyala"}
              </button>
              <p className="text-xs text-gray-400 mt-3">
                Bu anahtarı{" "}
                <Link href="/verify" className="text-amber-500 hover:underline">Doğrulama</Link>{" "}
                sayfasında kontrol edebilirsiniz.
              </p>
            </>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-amber-800 text-sm">
                Anahtarınız hazırlanıyor. Lütfen{" "}
                <Link href="/profile" className="underline font-medium">Profilim</Link>{" "}
                sayfasını kontrol edin.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
          <p className="text-amber-800 text-sm">
            Ödeme işleminiz alındı. Anahtarınız için{" "}
            <Link href="/profile" className="underline font-medium">Profilim</Link>{" "}
            sayfasını kontrol edin.
          </p>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <Link href="/games" className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
          Alışverişe Devam Et
        </Link>
        <Link href="/profile" className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition">
          Profilim <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-20 px-4">
        <Suspense fallback={
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
