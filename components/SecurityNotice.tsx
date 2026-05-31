"use client";
import { useEffect, useState } from "react";
import { ShieldCheck, X } from "lucide-react";

const KEY = "kadestore.securityNoticeDismissed";

export default function SecurityNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setVisible(localStorage.getItem(KEY) !== "1");
  }, []);

  if (!visible) return null;

  function dismiss() {
    localStorage.setItem(KEY, "1");
    setVisible(false);
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] bg-gray-900 text-gray-200 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-start gap-3">
        <ShieldCheck size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed flex-1">
          <strong className="text-white">Güvenlik Bildirimi:</strong> Bu site, hesap güvenliğinizi sağlamak ve
          yetkisiz erişimleri önlemek amacıyla tarayıcı parmak izi ve cihaz tanımlayıcılar gibi teknik veriler
          toplamaktadır. Toplanan veriler yalnızca kendi sunucularımızda saklanır; üçüncü taraflarla paylaşılmaz.
        </p>
        <button
          onClick={dismiss}
          aria-label="Kapat"
          className="p-1 text-gray-400 hover:text-white transition flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
