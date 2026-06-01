"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "Sipariş verdikten ne kadar sonra anahtarı alırım?",
    a: "Ödeme onaylandıktan sonra ortalama 30 saniye içinde hem sitedeki profil sayfanıza hem de e-posta adresinize anahtarınız iletilir.",
  },
  {
    q: "Anahtar geçersiz çıkarsa ne yapmalıyım?",
    a: "Satın alma tarihinden itibaren 7 gün içinde destek@kadestore.com adresine başvurarak ya yeni bir anahtarla değiştirme ya da tam iade talep edebilirsiniz.",
  },
  {
    q: "Hangi platformlar destekleniyor?",
    a: "Steam, Epic Games, Xbox, PlayStation, Nintendo, GOG, Ubisoft Connect ve Battle.net için anahtarlar satıyoruz. PC dijital ürünleri en geniş yelpazede mevcut.",
  },
  {
    q: "Hesap teslimi nedir, anahtar tesliminden farkı nedir?",
    a: "Bazı oyunlar 'hazır hesap' olarak satılır — size kullanıcı adı, şifre ve Steam Guard üreteci verilir. Anahtar tesliminde ise sadece tek kullanımlık aktivasyon kodu alırsınız.",
  },
  {
    q: "Steam Guard kodunu nasıl alırım?",
    a: "Hesap teslimli ürünler için profilinizdeki 'Guard Kodu Al' butonuna basın. 30 saniyede bir taze TOTP kodu üretilir, herhangi bir uygulama gerekmez.",
  },
  {
    q: "Ödeme yöntemleri nelerdir?",
    a: "Kredi kartı, banka kartı ve havale/EFT (Shopier altyapısı üzerinden). Tüm ödemeler 3D Secure ile korunur.",
  },
  {
    q: "İade alabilir miyim?",
    a: "Dijital ürünlerde anında ifa edildiği için yasal cayma hakkı yoktur. Ancak anahtarın geçersiz/bozuk olması durumunda 7 gün içinde iade veya değişim sunuyoruz.",
  },
  {
    q: "Faturamı nasıl alabilirim?",
    a: "Tüm siparişler için elektronik fatura otomatik olarak e-posta adresinize gönderilir. Profil sayfanızdan da indirebilirsiniz (yakında).",
  },
  {
    q: "Hesabımı nasıl silebilirim?",
    a: "Profil sayfasındaki 'Hesabımı Sil' butonu ile KVKK 7. madde kapsamında hesabınızı silebilirsiniz. Fatura kayıtları yasal saklama süresi boyunca anonimleştirilerek tutulur.",
  },
  {
    q: "Rank sistemi nasıl çalışır?",
    a: "Aldığınız her oyun için 1 puan kazanırsınız. Belirli puan aralıklarında Bronze, Silver, Gold, Platinum, Diamond ve Elite rütbelerine ulaşır, hediye anahtarlar kazanırsınız.",
  },
  {
    q: "VPN ile farklı bölgeden aktivasyon yapabilir miyim?",
    a: "Hayır, Steam ve diğer platformlar bölge politikalarını sıkı takip eder. VPN ile farklı bölgede aktivasyon hesabınızın askıya alınmasına neden olabilir. Bu nedenle bu tür kullanımlar iade kapsamı dışındadır.",
  },
  {
    q: "Kupon kodumu nasıl uygularım?",
    a: "Oyun detay sayfasında 'Kupon kodu' alanına kodu girip onaylayın, indirim anında uygulanır. Her kupon bir kez ve kişiye özel kullanılabilir.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-100">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 red-glow opacity-30" />

        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block bg-[#FFF785]/10 text-[#FFF785] text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-[#FFF785]/20">
            <HelpCircle size={12} className="inline -mt-0.5 mr-1" /> Sıkça Sorulanlar
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            S.S.S.
          </h1>
          <p className="text-gray-400 mb-10">En çok merak edilenler ve cevapları.</p>

          <div className="space-y-2">
            {FAQS.map((item, i) => (
              <div
                key={i}
                className={`bg-[#111111] border rounded-2xl overflow-hidden transition ${
                  open === i ? "border-[#FFF785]/40" : "border-white/5"
                }`}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition"
                >
                  <span className="font-semibold text-white pr-4">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[#FFF785] flex-shrink-0 transition-transform ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-gray-300 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
