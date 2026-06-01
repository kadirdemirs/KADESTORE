import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { LifeBuoy, Mail, MessageCircle, FileText, ShoppingBag, Key, Shield, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yardım Merkezi",
  description: "KadeStore yardım merkezi — sorularınız ve destek için kılavuz.",
};

const TOPICS = [
  { icon: ShoppingBag, title: "Sipariş ve Teslimat", desc: "Sipariş takibi, teslimat süreleri, sorun çözümleri", href: "/faq" },
  { icon: Key, title: "Anahtar Aktivasyonu", desc: "Steam, Epic, Xbox için anahtar nasıl kullanılır", href: "/redeem" },
  { icon: Shield, title: "Hesap Güvenliği", desc: "Steam Guard, 2FA, şifre değişikliği", href: "/guard" },
  { icon: FileText, title: "Yasal", desc: "KVKK, çerez politikası, mesafeli satış", href: "/kvkk" },
];

export default function YardimPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-100">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 red-glow opacity-30" />

        <div className="relative max-w-5xl mx-auto">
          <span className="inline-block bg-[#FFF785]/10 text-[#FFF785] text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-[#FFF785]/20">
            <LifeBuoy size={12} className="inline -mt-0.5 mr-1" /> Yardım Merkezi
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Size Nasıl Yardımcı Olabiliriz?
          </h1>
          <p className="text-gray-400 mb-10 max-w-2xl">
            Aradığınız konuyu seçin ya da doğrudan destek ekibimizle iletişime geçin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
            {TOPICS.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.title}
                  href={t.href}
                  className="group bg-[#111111] border border-white/5 rounded-2xl p-5 hover:border-[#FFF785]/40 transition flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FFF785]/15 border border-[#FFF785]/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-[#FFF785]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-white group-hover:text-[#FFF785] transition">{t.title}</p>
                    <p className="text-sm text-gray-400 truncate">{t.desc}</p>
                  </div>
                  <ArrowUpRight size={18} className="text-gray-500 group-hover:text-[#FFF785] transition" />
                </Link>
              );
            })}
          </div>

          <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-2">Hâlâ Sorununuz mu Var?</h2>
            <p className="text-sm text-gray-400 mb-5">Bir kanal seçin, ortalama 15 dakika içinde dönüş yapalım:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <a href="mailto:destek@kadestore.com" className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition">
                <Mail size={18} className="text-[#FFF785] mb-2" />
                <p className="font-semibold text-white text-sm">E-posta</p>
                <p className="text-xs text-gray-400">destek@kadestore.com</p>
              </a>
              <Link href="/iletisim" className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition">
                <MessageCircle size={18} className="text-[#FFF785] mb-2" />
                <p className="font-semibold text-white text-sm">İletişim Formu</p>
                <p className="text-xs text-gray-400">Tüm kanallarımız</p>
              </Link>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <MessageCircle size={18} className="text-[#FFF785] mb-2" />
                <p className="font-semibold text-white text-sm">Canlı Destek</p>
                <p className="text-xs text-gray-400">Sağ alt köşede</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
