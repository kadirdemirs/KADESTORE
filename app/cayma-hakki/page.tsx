import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Info, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cayma Hakkı",
  description: "Mesafeli Sözleşmeler Yönetmeliği kapsamında cayma hakkı bilgilendirmesi.",
};

export default function CaymaHakkiPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-100">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Cayma Hakkı
          </h1>
          <p className="text-gray-400 mb-8">Mesafeli Sözleşmeler Yönetmeliği Md. 15</p>

          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 mb-8 flex gap-3">
            <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-white font-semibold mb-1">Önemli Bilgi</p>
              <p className="text-gray-300">
                Dijital olarak anında teslim edilen oyun anahtarı, hesap teslimi ve yazılım ürünleri için
                <strong className="text-white"> CAYMA HAKKI BULUNMAMAKTADIR.</strong>
              </p>
            </div>
          </div>

          <article className="space-y-6 text-gray-300 leading-relaxed">
            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">Yasal Dayanak</h2>
              <p>27/11/2014 tarihli ve 29188 sayılı Resmi Gazete'de yayımlanan Mesafeli Sözleşmeler Yönetmeliği'nin
              "Cayma hakkının istisnaları" başlıklı 15. maddesinin 1. fıkrası (ğ) bendinde:</p>
              <blockquote className="bg-white/5 border-l-4 border-[#FFF785] pl-4 py-3 my-3 text-gray-200 italic">
                "Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayri maddi mallara ilişkin
                sözleşmelerde tüketici cayma hakkını kullanamaz."
              </blockquote>
              <p>KadeStore'da satılan oyun anahtarları, hesap teslimleri ve yazılım lisansları bu kapsamdadır.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">Geçersiz/Bozuk Ürün Durumu</h2>
              <p>Cayma hakkı bulunmaması, KadeStore'un sorumluluğunu ortadan kaldırmaz. Aşağıdaki durumlarda
              <strong className="text-white"> tam iade veya yeni ürün ile değişim</strong> yapılır:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Anahtar daha önce başkası tarafından kullanılmışsa</li>
                <li>Anahtar yanlış oyuna ait ise</li>
                <li>Hesap teslimli ürünün giriş bilgileri çalışmıyor ise</li>
                <li>Teslim edilen ürün açıklamada belirtilenden farklı ise</li>
              </ul>
              <p className="mt-3"><strong className="text-white">Başvuru süresi:</strong> teslimat tarihinden itibaren 7 gün.<br />
              <strong className="text-white">Başvuru kanalı:</strong> destek@kadestore.com</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">İade Edilemeyen Durumlar</h2>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Anahtar zaten kullanıldıktan sonra "beğenmedim" denilmesi</li>
                <li>VPN ile farklı bölgede aktivasyon denemesi</li>
                <li>Hesap teslimli üründe şifre değişikliği yapıldıktan sonra erişim sorunu</li>
                <li>Platform politikalarına aykırı kullanım nedeniyle hesap kapatılması</li>
                <li>Teslimat tarihinden 7 gün sonraki başvurular</li>
              </ul>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-3">
              <Info size={20} className="text-[#FFF785] flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-white font-semibold mb-1">Onay</p>
                <p>Satın alma esnasında ürünün dijital olarak anında teslim edildiğini ve cayma hakkının
                bulunmadığını okuyup kabul ederek devam etmiş olursunuz.</p>
              </div>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
