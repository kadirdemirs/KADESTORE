import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-[#0a0a0a] py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Kullanım Şartları</h1>
          <p className="text-gray-500 text-sm mb-8">Son güncelleme: Ocak 2026</p>
          <div className="bg-[#111111] rounded-2xl border border-white/5 shadow-2xl p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
            {[
              { title: "1. Genel Koşullar", body: "KadeStore platformunu kullanarak bu kullanım şartlarını kabul etmiş sayılırsınız. 18 yaşın altındaysanız ebeveyn gözetiminde kullanmanız gerekmektedir." },
              { title: "2. Hesap Güvenliği", body: "Hesabınızın güvenliğinden siz sorumlusunuz. Şifrenizi kimseyle paylaşmayın ve başkalarının erişimine izin vermeyin. Şüpheli bir durumda derhal destek ekibimize bildirin." },
              { title: "3. Satın Alma ve İade", body: "Dijital ürünlerin niteliği gereği, anahtar teslim edildikten sonra iade yapılamamaktadır. Anahtar teslim edilmemişse veya hatalıysa tam iade hakkınız saklıdır." },
              { title: "4. Yasaklı Faaliyetler", body: "Platform üzerinde dolandırıcılık, hile, başka kullanıcılara zarar verecek faaliyetler ve sistemi kötüye kullanmak kesinlikle yasaktır. Bu tür davranışlar hesabın kalıcı olarak kapatılmasına neden olur." },
              { title: "5. Fikri Mülkiyet", body: "KadeStore markası, logosu ve içerikleri telif hakkı ile korunmaktadır. Satılan oyun anahtarları ilgili yayıncıların lisans hakları kapsamındadır." },
              { title: "6. Sorumluluk Sınırı", body: "KadeStore, platformdaki teknik aksaklıklar nedeniyle doğabilecek dolaylı zararlardan sorumlu tutulamaz. Doğrudan ürün hataları için tam sorumluluk kabul edilir." },
              { title: "7. Değişiklikler", body: "Bu kullanım şartları önceden bildirim yapılmaksızın güncellenebilir. Güncel şartlar her zaman bu sayfada yayınlanır." },
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
