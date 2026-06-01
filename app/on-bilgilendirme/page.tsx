import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ön Bilgilendirme Formu",
  description: "Mesafeli sözleşme öncesi yasal ön bilgilendirme.",
};

export default function OnBilgilendirmePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-100">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Ön Bilgilendirme Formu
          </h1>
          <p className="text-gray-400 mb-8">Mesafeli Sözleşmeler Yönetmeliği Md. 5 kapsamında.</p>

          <article className="space-y-6 text-gray-300 leading-relaxed">
            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">Satıcı Bilgileri</h2>
              <p><strong className="text-white">Unvan:</strong> KadeMedia / KadeStore<br />
              <strong className="text-white">Adres:</strong> İstanbul, Türkiye<br />
              <strong className="text-white">İletişim:</strong> destek@kadestore.com<br />
              <strong className="text-white">MERSİS:</strong> [Doldurun]<br />
              <strong className="text-white">Vergi Dairesi/No:</strong> [Doldurun]</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">Ürünün Temel Nitelikleri</h2>
              <p>Dijital içerikli oyun anahtarı, oyun hesabı veya yazılım lisansı. Ürünün adı, türü, platformu,
              fiyatı ve diğer detayları sipariş onay sayfasında ayrıntılı şekilde gösterilir.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">Fiyat ve Ödeme</h2>
              <p>Tüm fiyatlar Türk Lirası (TL) cinsindendir ve KDV dahildir. Ödeme; kredi kartı, banka kartı
              veya sitedeki diğer ödeme yöntemleriyle yapılabilir. Tahsilat Shopier altyapısı üzerinden gerçekleştirilir.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">Teslimat</h2>
              <p>Ödeme onayını takiben dijital ürün, kullanıcıya ait hesap paneline ve kayıtlı e-posta adresine
              ortalama 30 saniye içinde teslim edilir. Maksimum teslimat süresi 24 saattir.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">Cayma Hakkı</h2>
              <p>Mesafeli Sözleşmeler Yönetmeliği Madde 15/1-(ğ) gereğince <strong className="text-white">elektronik ortamda anında ifa edilen
              hizmetler ve dijital içeriklerde cayma hakkı bulunmamaktadır.</strong> ALICI, ürünün dijital olarak teslim
              edildiğini ve cayma hakkını kullanamayacağını peşinen kabul eder.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">Geçersiz/Bozuk Ürün</h2>
              <p>Teslim edilen anahtar geçersiz ise satın alma tarihinden itibaren 7 gün içinde destek@kadestore.com
              adresine başvurulması halinde yenisi gönderilir veya ödeme tutarı iade edilir.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">Şikayet Mercileri</h2>
              <p>Tüketici Hakem Heyeti veya Tüketici Mahkemeleri (parasal sınıra göre).</p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-sm">
                <strong className="text-white">Onay:</strong> Sipariş onayı tıklandığı anda işbu Ön Bilgilendirme Formu
                okunmuş ve içeriği kabul edilmiş sayılır.
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
