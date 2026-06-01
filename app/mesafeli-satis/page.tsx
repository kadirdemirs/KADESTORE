import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description: "KadeStore Mesafeli Satış Sözleşmesi — 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında.",
};

export default function MesafeliSatisPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-100">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Mesafeli Satış Sözleşmesi
          </h1>
          <p className="text-gray-400 mb-8">Son güncelleme: 1 Haziran 2026</p>

          <article className="space-y-6 text-gray-300 leading-relaxed">
            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">1. Taraflar</h2>
              <p><strong className="text-white">SATICI:</strong> KadeMedia / KadeStore (örnek bilgiler — gerçek şirket bilgileri ile değiştirin)<br />
              Adres: İstanbul, Türkiye<br />
              MERSİS No: [Doldurun]<br />
              Vergi No: [Doldurun]<br />
              E-posta: destek@kadestore.com<br />
              KEP: [Doldurun]</p>
              <p className="mt-3"><strong className="text-white">ALICI:</strong> Bu Sözleşme'yi kabul ederek alışveriş yapan kullanıcı.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">2. Sözleşmenin Konusu</h2>
              <p>İşbu Sözleşme, ALICI'nın SATICI'ya ait kadestore.com adlı web sitesinden, elektronik ortamda sipariş verdiği,
              dijital içerikli ürünlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun
              ve Mesafeli Sözleşmeler Yönetmeliği hükümleri uyarınca tarafların hak ve yükümlülüklerini düzenler.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">3. Ürün Bilgileri</h2>
              <p>Satışa konu ürün(ler): Sipariş özetinde belirtilen dijital oyun anahtarları, hesap teslimleri ve ilgili dijital
              içerikler. Ürün adı, adedi ve satış bedeli sipariş onayı sayfasında ayrıntılı olarak gösterilir.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">4. Ödeme ve Teslimat</h2>
              <p>Ödeme, sitemizde sunulan ödeme yöntemleriyle (Shopier altyapısı üzerinden kredi/banka kartı) gerçekleştirilir.
              Tüm fiyatlara KDV dahildir.</p>
              <p>Ödemenin onaylanmasını takiben dijital ürün, kullanıcının üye paneline ve e-posta adresine ortalama <strong className="text-white">30 saniye</strong>
              içinde otomatik olarak iletilir. Stokta beklenmedik bir gecikme olması durumunda ALICI'ya derhal bilgi verilir.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">5. Cayma Hakkı</h2>
              <p>Mesafeli Sözleşmeler Yönetmeliği Madde 15/1-(ğ) uyarınca, <strong className="text-white">elektronik ortamda
              anında ifa edilen ve tüketiciye elektronik ortamda anında teslim olunan gayri maddi mallar (yazılım, oyun anahtarı, dijital hesap vb.)
              için cayma hakkı bulunmamaktadır.</strong></p>
              <p>ALICI bu ürünleri satın alarak ürünün anında ifasını kabul ettiğini ve cayma hakkının
              bulunmadığını peşinen kabul etmiş sayılır.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">6. Garanti ve İade</h2>
              <p>Teslim edilen anahtar/hesap geçersiz veya başkası tarafından kullanılmış ise <strong className="text-white">7 gün</strong>
              içinde destek@kadestore.com adresinden bildirim yapılması koşuluyla yeni bir anahtarla değiştirilir veya
              ödeme iadesi yapılır.</p>
              <p>Aşağıdaki durumlarda iade kabul edilmez:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Anahtarın hatalı kullanımı (yanlış hesaba aktivasyon vb.)</li>
                <li>Steam/Epic/Xbox vb. platform politikalarına aykırı kullanım</li>
                <li>VPN ile farklı bölgede aktivasyon denemesi</li>
                <li>Teslimat tamamlandıktan 7 gün sonraki başvurular</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">7. Şikayet ve Uyuşmazlık</h2>
              <p>Tüketici, uyuşmazlık halinde 6502 sayılı Kanun kapsamında ikametgâhının bulunduğu yerdeki Tüketici Hakem Heyeti
              veya Tüketici Mahkemesi'ne başvurabilir.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">8. Bildirimler ve Delil Sözleşmesi</h2>
              <p>Tarafların bu sözleşmeden doğacak işlemleri için yapacakları her türlü yazışma, sistem kayıtları, elektronik
              kayıtlar, ticari kayıtlar ve bilgisayar kayıtları, 6100 sayılı HMK Madde 193 uyarınca kesin delil sayılacaktır.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">9. Kabul</h2>
              <p>ALICI, sipariş verdiği aşamada işbu Sözleşme'nin tüm koşullarını okuyup anladığını ve kabul ettiğini taahhüt eder.</p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
