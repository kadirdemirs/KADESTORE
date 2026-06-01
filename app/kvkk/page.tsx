import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.",
};

export default function KvkkPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-100">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            KVKK Aydınlatma Metni
          </h1>
          <p className="text-gray-400 mb-8">6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında.</p>

          <article className="space-y-6 text-gray-300 leading-relaxed">
            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">1. Veri Sorumlusu</h2>
              <p>KadeMedia / KadeStore (bundan sonra "KadeStore" olarak anılacaktır), 6698 sayılı Kişisel Verilerin Korunması Kanunu
              ("KVKK") kapsamında veri sorumlusu sıfatıyla hareket etmektedir.</p>
              <p>VERBİS Sicil No: [Doldurun]<br />
              İletişim: destek@kadestore.com</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">2. İşlenen Kişisel Veriler</h2>
              <ul className="list-disc list-inside space-y-1">
                <li><strong className="text-white">Kimlik:</strong> Ad, soyad</li>
                <li><strong className="text-white">İletişim:</strong> E-posta, telefon (opsiyonel)</li>
                <li><strong className="text-white">Müşteri İşlem:</strong> Sipariş, fatura, ödeme bilgileri (Shopier üzerinden)</li>
                <li><strong className="text-white">İşlem Güvenliği:</strong> IP adresi, tarayıcı parmak izi, cihaz tanımlayıcılar</li>
                <li><strong className="text-white">Pazarlama:</strong> Çerez verileri, kampanya etkileşimi (rıza halinde)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">3. İşleme Amacı ve Hukuki Sebep</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Üyelik ve kullanıcı hesabı yönetimi (KVKK 5/2-c: sözleşmenin kurulması)</li>
                <li>Sipariş süreçlerinin yürütülmesi ve teslimat (KVKK 5/2-c)</li>
                <li>Faturalandırma ve mali yükümlülüklerin yerine getirilmesi (KVKK 5/2-a: kanunda öngörülmesi)</li>
                <li>Hesap güvenliği, dolandırıcılığın önlenmesi (KVKK 5/2-f: meşru menfaat)</li>
                <li>Pazarlama ve kampanya bildirimleri (KVKK 5/1: açık rıza)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">4. Veri Aktarımı</h2>
              <p>Kişisel verileriniz; ödeme hizmetleri için Shopier'a, sunucu altyapısı için Vercel'a (yurt dışı),
              veri tabanı için Neon Tech'e (yurt dışı), e-posta iletimi için SMTP sağlayıcısına aktarılabilir. Yurt dışı
              aktarım KVKK 9. madde çerçevesinde, sözleşmesel güvenceler dahilinde yapılmaktadır.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">5. Saklama Süresi</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Üyelik verileri: hesabın silinmesine kadar + 10 yıl (TTK gereği)</li>
                <li>Sipariş/fatura: 10 yıl (Vergi Usul Kanunu)</li>
                <li>Güvenlik logları: 2 yıl</li>
                <li>Pazarlama izinleri: izin geri çekilene kadar</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">6. KVKK 11. Madde Kapsamındaki Haklarınız</h2>
              <p>Kişisel verilerinizle ilgili olarak:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>İşlenip işlenmediğini öğrenme</li>
                <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                <li>İşleme amacı ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Yurt içi/dışı aktarılan üçüncü kişileri öğrenme</li>
                <li>Eksik/yanlış işlenmişse düzeltilmesini isteme</li>
                <li>KVKK 7 çerçevesinde silinmesini veya yok edilmesini isteme</li>
                <li>Otomatik sistemlerle aleyhinize bir sonuca itiraz etme</li>
                <li>Kanuna aykırı işleme nedeniyle zarara uğrarsanız tazminat talep etme</li>
              </ul>
              <p className="mt-3">Başvurularınızı destek@kadestore.com adresine yapabilirsiniz. 30 gün içinde
              cevap verilecektir.</p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
