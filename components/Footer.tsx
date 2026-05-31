import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
              <span className="font-bold text-lg text-gray-900">KadeStore</span>
            </div>
            <p className="text-sm text-gray-500">Dijital oyun dünyasının güvenilir adresi.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">SAYFALAR</h4>
            <ul className="space-y-2">
              <li><Link href="/games" className="text-sm text-gray-500 hover:text-amber-500 transition">Oyunlar</Link></li>
              <li><Link href="/redeem" className="text-sm text-gray-500 hover:text-amber-500 transition">Kod Etkinleştir</Link></li>
              <li><Link href="/steam-guard" className="text-sm text-gray-500 hover:text-amber-500 transition">Steam Guard</Link></li>
              <li><Link href="/guard" className="text-sm text-gray-500 hover:text-amber-500 transition">Guard</Link></li>
              <li><Link href="/verify" className="text-sm text-gray-500 hover:text-amber-500 transition">Doğrulama</Link></li>
              <li><Link href="/profile" className="text-sm text-gray-500 hover:text-amber-500 transition">Profil</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">YASAL</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-amber-500 transition">Gizlilik</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-500 hover:text-amber-500 transition">Kullanım Şartları</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">SOSYAL</h4>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-amber-100 flex items-center justify-center transition text-gray-500 hover:text-amber-600 text-xs font-bold">X</a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-amber-100 flex items-center justify-center transition text-gray-500 hover:text-amber-600 text-xs font-bold">TW</a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-amber-100 flex items-center justify-center transition text-gray-500 hover:text-amber-600 text-xs font-bold">IG</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© 2026 KadeStore</p>
          <p className="text-xs text-gray-400">by KadeMedia</p>
        </div>
      </div>
    </footer>
  );
}
