import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-[#0a0a0a] py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Gizlilik Politikası</h1>
          <p className="text-gray-500 text-sm mb-8">Son güncelleme: Ocak 2026</p>
          <div className="bg-[#111111] rounded-2xl border border-white/5 shadow-2xl p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
            {[
              { title: "1. Toplanan Bilgiler", body: "KadeStore olarak, hizmetlerimizi kullanmanız sırasında ad, e-posta adresi ve ödeme bilgileriniz gibi kişisel verileri toplayabiliriz. Bu veriler yalnızca hizmet sunumu ve güvenlik amacıyla kullanılır." },
              { title: "2. Verilerin Kullanımı", body: "Topladığımız veriler; sipariş işleme, müşteri desteği, güvenlik doğrulama ve yasal yükümlülüklerin yerine getirilmesi amacıyla kullanılır. Verileriniz üçüncü taraflarla pazarlama amacıyla paylaşılmaz." },
              { title: "3. Veri Güvenliği", body: "Kişisel verileriniz 256-bit SSL şifreleme ile korunmaktadır. Sunucularımız endüstri standardı güvenlik protokollerine uygun şekilde yapılandırılmıştır." },
              { title: "4. Çerezler", body: "Sitemiz, kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz; ancak bu, sitenin bazı özelliklerini etkileyebilir." },
              { title: "5. Haklarınız", body: "KVKK kapsamında; verilerinize erişme, düzeltme, silme ve işlenmesine itiraz etme haklarına sahipsiniz. Talepleriniz için destek ekibimizle iletişime geçebilirsiniz." },
              { title: "6. İletişim", body: "Gizlilik politikamıza ilişkin sorularınız için destek@kadestore.com adresine e-posta gönderebilirsiniz." },
            ].map((section) => (
              <div key={section.title}>
                <h2 className="font-bold text-white mb-2">{section.title}</h2>
                <p>{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
