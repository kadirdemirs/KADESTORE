import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, CheckCircle } from "lucide-react";

export default function GuardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">KadeStore Guard</h1>
            <p className="text-gray-500 mt-2">Alışveriş güvenceniz her zaman yanınızda.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Nasıl Çalışır?</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              KadeStore Guard, satın aldığınız dijital oyun anahtarlarının güvenliğini ve geçerliliğini garanti eden koruma sistemimizdir.
              Her anahtar, dağıtılmadan önce sistemimizde doğrulanır.
            </p>
            <div className="space-y-3">
              {[
                "Tüm anahtarlar satış öncesi doğrulanır",
                "Geçersiz anahtar durumunda tam iade garantisi",
                "7/24 destek ekibi yanınızda",
                "Anlık teslimat sistemi ile sahte ürün riski sıfır",
                "256-bit SSL şifreleme ile güvenli alışveriş",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <p className="text-green-800 font-semibold mb-1">Guard Aktif</p>
            <p className="text-green-600 text-sm">KadeStore Guard sistemi şu anda aktif ve tüm satışlarınızı koruma altında tutuyor.</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-green-600 font-medium">Sistem aktif</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
