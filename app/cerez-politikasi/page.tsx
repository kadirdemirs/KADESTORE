import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description: "KadeStore'da kullanılan çerezler ve yönetimi.",
};

export default function CerezPolitikasiPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-100">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Çerez Politikası
          </h1>
          <p className="text-gray-400 mb-8">Son güncelleme: 1 Haziran 2026</p>

          <article className="space-y-6 text-gray-300 leading-relaxed">
            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">Çerez Nedir?</h2>
              <p>Çerezler, ziyaret ettiğiniz web siteleri tarafından tarayıcınız aracılığıyla cihazınıza yerleştirilen küçük
              metin dosyalarıdır. Site deneyiminizi iyileştirir ve oturum bilgilerinizi korur.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">Kullandığımız Çerez Türleri</h2>
              <div className="space-y-4 mt-3">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="font-semibold text-white mb-1">Zorunlu Çerezler</p>
                  <p className="text-sm">Oturum açma, sepet, güvenlik ve dil seçimi gibi temel işlevler için
                  gereklidir. <strong>Devre dışı bırakılamaz.</strong></p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="font-semibold text-white mb-1">Performans Çerezleri</p>
                  <p className="text-sm">Sayfa yükleme süresi, hata izleme gibi istatistikleri toplar. Anonim ve
                  kullanıcıyı kişisel olarak tanımlamaz.</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="font-semibold text-white mb-1">Pazarlama Çerezleri (Opsiyonel)</p>
                  <p className="text-sm">Reklam ve kampanya kişiselleştirmesi için kullanılır. <strong>Yalnızca rıza
                  vermeniz halinde aktif olur.</strong></p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">Çerezleri Nasıl Yönetebilirsiniz?</h2>
              <p>Tarayıcınızın ayarlarından çerezleri görüntüleyebilir, silebilir ve gelecekte çerez yerleştirilmesini
              engelleyebilirsiniz. Bazı çerezleri devre dışı bıraktığınızda site özelliklerinden bazıları çalışmayabilir.</p>
              <ul className="list-disc list-inside space-y-1 mt-3">
                <li><a className="text-[#FFF785] hover:underline" href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">Chrome</a></li>
                <li><a className="text-[#FFF785] hover:underline" href="https://support.mozilla.org/tr/kb/Çerezler" target="_blank" rel="noopener">Firefox</a></li>
                <li><a className="text-[#FFF785] hover:underline" href="https://support.apple.com/tr-tr/guide/safari/sfri11471/mac" target="_blank" rel="noopener">Safari</a></li>
                <li><a className="text-[#FFF785] hover:underline" href="https://support.microsoft.com/tr-tr/microsoft-edge" target="_blank" rel="noopener">Edge</a></li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">Üçüncü Taraf Çerezler</h2>
              <p>Ödeme işlemleri için Shopier, hata izleme için Sentry, analitik için Plausible (planlanan) üçüncü taraf
              çerezleri kullanılabilir. Bu sağlayıcıların kendi gizlilik politikaları geçerlidir.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white mb-2">İletişim</h2>
              <p>Çerez politikamızla ilgili sorularınız için: <a className="text-[#FFF785] hover:underline" href="mailto:destek@kadestore.com">destek@kadestore.com</a></p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
