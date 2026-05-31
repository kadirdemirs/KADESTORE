"use client";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CancelContent() {
  const params = useSearchParams();
  const orderId = params.get("order");

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
        <XCircle size={40} className="text-red-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Ödeme İptal Edildi</h1>
      <p className="text-gray-500 mb-8">
        Ödeme işleminiz tamamlanamadı veya iptal edildi. Tekrar denemek için aşağıdaki butonu kullanın.
      </p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 text-left">
        <h2 className="font-semibold text-gray-900 mb-3">Sık Karşılaşılan Sorunlar</h2>
        <ul className="space-y-2 text-sm text-gray-500">
          <li>• Kart bilgilerinizi kontrol edin</li>
          <li>• 3D Secure doğrulamasını tamamladığınızdan emin olun</li>
          <li>• Kartınızın internet alışverişine açık olduğunu kontrol edin</li>
          <li>• Farklı bir kart veya ödeme yöntemi deneyin</li>
        </ul>
      </div>

      <div className="flex gap-3 justify-center">
        <Link href="/games" className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
          <ArrowLeft size={16} /> Oyunlara Dön
        </Link>
        <Link href="/games" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition">
          <RefreshCw size={16} /> Tekrar Dene
        </Link>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-20 px-4">
        <Suspense fallback={<div />}>
          <CancelContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
