import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
  description: "KadeStore ile iletişime geçin — destek, sorular ve iş birlikleri için.",
};

export default function IletisimPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-gray-100">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 red-glow opacity-30" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#FFF785]/10 blur-[120px]" />

        <div className="relative max-w-4xl mx-auto">
          <span className="inline-block bg-[#FFF785]/10 text-[#FFF785] text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-[#FFF785]/20">
            İletişim
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Bize Ulaşın
          </h1>
          <p className="text-gray-400 mb-12 max-w-2xl">
            Sorularınız, talepleriniz veya iş birlikleri için bize ulaşmaktan çekinmeyin.
            Ekibimiz size 15 dakika içinde dönüş yapacak.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <a href="mailto:destek@kadestore.com" className="group bg-[#111111] border border-white/5 rounded-3xl p-6 hover:border-[#FFF785]/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF785]/15 border border-[#FFF785]/20 flex items-center justify-center mb-4">
                <Mail size={20} className="text-[#FFF785]" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">E-posta</p>
              <p className="font-display text-xl font-bold text-white group-hover:text-[#FFF785] transition">destek@kadestore.com</p>
              <p className="text-sm text-gray-400 mt-2">Genel sorular, sipariş takibi, destek</p>
            </a>

            <a href="tel:+905530000000" className="group bg-[#111111] border border-white/5 rounded-3xl p-6 hover:border-[#FFF785]/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF785]/15 border border-[#FFF785]/20 flex items-center justify-center mb-4">
                <Phone size={20} className="text-[#FFF785]" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Telefon</p>
              <p className="font-display text-xl font-bold text-white group-hover:text-[#FFF785] transition">+90 (553) 000 00 00</p>
              <p className="text-sm text-gray-400 mt-2">Hafta içi 09:00–22:00</p>
            </a>

            <div className="bg-[#111111] border border-white/5 rounded-3xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF785]/15 border border-[#FFF785]/20 flex items-center justify-center mb-4">
                <MessageCircle size={20} className="text-[#FFF785]" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Canlı Destek</p>
              <p className="font-display text-xl font-bold text-white">Sağ alt köşede</p>
              <p className="text-sm text-gray-400 mt-2">Anlık yanıt — 7/24</p>
            </div>

            <div className="bg-[#111111] border border-white/5 rounded-3xl p-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF785]/15 border border-[#FFF785]/20 flex items-center justify-center mb-4">
                <Clock size={20} className="text-[#FFF785]" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Yanıt Süresi</p>
              <p className="font-display text-xl font-bold text-white">~15 dakika</p>
              <p className="text-sm text-gray-400 mt-2">Tüm kanallar için ortalama</p>
            </div>
          </div>

          <div className="bg-[#111111] border border-white/5 rounded-3xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">Şirket Bilgileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm text-gray-300">
              <div><strong className="text-white">Unvan:</strong> KadeMedia / KadeStore</div>
              <div><strong className="text-white">Adres:</strong> İstanbul, Türkiye</div>
              <div><strong className="text-white">MERSİS No:</strong> [Doldurun]</div>
              <div><strong className="text-white">Vergi Dairesi:</strong> [Doldurun]</div>
              <div><strong className="text-white">Vergi No:</strong> [Doldurun]</div>
              <div><strong className="text-white">KEP Adresi:</strong> [Doldurun]</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
