import Link from "next/link";
import { Mail, Phone, Gamepad2 } from "lucide-react";

const InstagramIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const XIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const DiscordIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
      {/* Top giant brand */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6">
        <div className="flex items-center gap-3">
          <Gamepad2 size={28} className="text-[#FFF785]" />
          <span className="font-display text-3xl font-black text-white tracking-tight">kadestore</span>
        </div>
      </div>

      <div className="h-px bg-white/5 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand desc */}
          <div className="md:col-span-1">
            <p className="text-sm text-gray-400 leading-relaxed">
              Dijital oyun dünyasının güvenilir adresi. Anında teslimat, güvenli ödeme,
              7/24 destek.
            </p>
            <div className="flex gap-2 mt-5">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-[#FFF785] hover:border-[#FFF785] flex items-center justify-center text-gray-300 hover:text-[#0a0a0a] transition">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="X (Twitter)" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-[#FFF785] hover:border-[#FFF785] flex items-center justify-center text-gray-300 hover:text-[#0a0a0a] transition">
                <XIcon />
              </a>
              <a href="#" aria-label="Discord" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-[#FFF785] hover:border-[#FFF785] flex items-center justify-center text-gray-300 hover:text-[#0a0a0a] transition">
                <DiscordIcon />
              </a>
            </div>
          </div>

          {/* Hızlı menü */}
          <div>
            <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-5">Hızlı Menü</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-gray-400 hover:text-[#FFF785] transition">Ana Sayfa</Link></li>
              <li><Link href="/games" className="text-sm text-gray-400 hover:text-[#FFF785] transition">Oyunlar</Link></li>
              <li><Link href="/rewards" className="text-sm text-gray-400 hover:text-[#FFF785] transition">Ödüller</Link></li>
              <li><Link href="/redeem" className="text-sm text-gray-400 hover:text-[#FFF785] transition">Kod Etkinleştir</Link></li>
              <li><Link href="/verify" className="text-sm text-gray-400 hover:text-[#FFF785] transition">Doğrulama</Link></li>
            </ul>
          </div>

          {/* Hesap */}
          <div>
            <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-5">Hesap</h4>
            <ul className="space-y-3">
              <li><Link href="/login" className="text-sm text-gray-400 hover:text-[#FFF785] transition">Giriş Yap</Link></li>
              <li><Link href="/register" className="text-sm text-gray-400 hover:text-[#FFF785] transition">Kayıt Ol</Link></li>
              <li><Link href="/profile" className="text-sm text-gray-400 hover:text-[#FFF785] transition">Profilim</Link></li>
              <li><Link href="/guard" className="text-sm text-gray-400 hover:text-[#FFF785] transition">Steam Guard</Link></li>
              <li><Link href="/change-password" className="text-sm text-gray-400 hover:text-[#FFF785] transition">Şifre Değiştir</Link></li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-5">İletişim</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:destek@kadestore.com" className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#FFF785] transition">
                  <Mail size={14} /> destek@kadestore.com
                </a>
              </li>
              <li>
                <a href="tel:+905530000000" className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#FFF785] transition">
                  <Phone size={14} /> +90 (553) 000 00 00
                </a>
              </li>
              <li className="pt-1">
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-[#FFF785] transition block">Gizlilik Politikası</Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-400 hover:text-[#FFF785] transition block">Kullanım Şartları</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom giant marquee text */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">© 2026 KadeStore. Tüm hakları saklıdır.</p>
          <p className="text-xs text-gray-500">by <span className="text-[#FFF785] font-semibold">KadeMedia</span></p>
        </div>
      </div>
    </footer>
  );
}
