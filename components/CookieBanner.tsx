"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

const KEY = "kadestore.cookieConsent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setVisible(!localStorage.getItem(KEY));
  }, []);

  function setConsent(value: "all" | "necessary") {
    localStorage.setItem(KEY, value);
    setVisible(false);
    // Pazarlama çerezleri için CustomEvent (analytics provider'lar dinleyebilir)
    window.dispatchEvent(new CustomEvent("cookieConsent", { detail: value }));
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[70] p-3 md:p-4 animate-fadeIn">
      <div className="max-w-4xl mx-auto bg-[#111111] border border-white/10 rounded-2xl shadow-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#FFF785]/15 border border-[#FFF785]/20 flex items-center justify-center">
          <Cookie size={20} className="text-[#FFF785]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-semibold mb-1">Çerez Kullanıyoruz</p>
          <p className="text-xs text-gray-400">
            Sitemizi daha iyi hale getirmek için zorunlu ve performans çerezleri kullanırız.
            Pazarlama çerezleri için rızanız gereklidir.{" "}
            <Link href="/cerez-politikasi" className="text-[#FFF785] hover:underline">Detaylı bilgi</Link>
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setConsent("necessary")}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm rounded-full font-medium transition whitespace-nowrap"
          >
            Sadece Zorunlu
          </button>
          <button
            onClick={() => setConsent("all")}
            className="flex-1 md:flex-initial px-5 py-2.5 bg-[#FFF785] hover:bg-[#FFE74F] text-[#0a0a0a] text-sm rounded-full font-semibold transition whitespace-nowrap"
          >
            Tümünü Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
