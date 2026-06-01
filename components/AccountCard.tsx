"use client";
import { useEffect, useRef, useState } from "react";
import { Copy, Check, Eye, EyeOff, Shield, Gamepad2, KeyRound } from "lucide-react";

export interface LibraryItem {
  id: string;
  source: string;
  claimedAt: string;
  deliveryType: string;
  gameKey: {
    key: string | null;
    steamUsername: string | null;
    steamPassword: string | null;
    accountNote: string | null;
    hasGuard: boolean;
    game: { title: string; platform: string; genre: string; imageUrl: string; slug: string; deliveryType: string };
  };
}

function CopyBtn({ value, onCopy, copied }: { value: string; onCopy: () => void; copied: boolean }) {
  return (
    <button
      onClick={onCopy}
      title="Kopyala"
      className="p-1.5 text-gray-500 hover:text-[#FFF785] hover:bg-[#FFF785]/10 dark:hover:bg-[#FFF785]/10 rounded-lg transition flex-shrink-0"
    >
      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
    </button>
  );
}

export default function AccountCard({ item }: { item: LibraryItem }) {
  const g = item.gameKey.game;
  const isAccount = item.deliveryType === "account";
  const [showPass, setShowPass] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Guard kodu durumu
  const [guard, setGuard] = useState<{ code: string; secsLeft: number } | null>(null);
  const [guardLoading, setGuardLoading] = useState(false);
  const [guardError, setGuardError] = useState("");
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function copy(field: string, value: string) {
    navigator.clipboard.writeText(value);
    setCopied(field);
    setTimeout(() => setCopied((c) => (c === field ? null : c)), 1800);
  }

  async function fetchGuard() {
    setGuardLoading(true);
    setGuardError("");
    try {
      const res = await fetch("/api/guard-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userKeyId: item.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGuardError(data.error || "Kod alınamadı.");
        setGuard(null);
      } else {
        setGuard({ code: data.code, secsLeft: data.secsLeft });
      }
    } catch {
      setGuardError("Bağlantı hatası.");
    }
    setGuardLoading(false);
  }

  // Kod aktifken her saniye geri sayımı düşür, süre dolunca yenile
  useEffect(() => {
    if (!guard) return;
    tickRef.current = setInterval(() => {
      setGuard((prev) => {
        if (!prev) return prev;
        if (prev.secsLeft <= 1) {
          fetchGuard();
          return prev;
        }
        return { ...prev, secsLeft: prev.secsLeft - 1 };
      });
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guard !== null]);

  return (
    <div className="bg-[#111111] dark:bg-gray-900 rounded-2xl border border-white/5 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col">
      {/* Görsel */}
      <div className="h-32 bg-gradient-to-br from-[#FFE74F] to-[#FFE74F] relative">
        {g.imageUrl ? (
          <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Gamepad2 size={28} className="text-white/70" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-md">{g.platform}</span>
        </div>
        <div className="absolute top-2 right-2">
          <span className="bg-green-500 text-white text-[11px] px-2 py-0.5 rounded-md font-medium">AKTİF</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <p className="font-bold text-white dark:text-white text-sm leading-snug">{g.title}</p>

        {isAccount ? (
          <div className="mt-3 space-y-2">
            {/* Kullanıcı adı */}
            <div className="flex items-center gap-2 bg-[#0a0a0a] dark:bg-gray-800 rounded-xl px-3 py-2">
              <span className="text-[11px] font-semibold text-gray-500 uppercase w-12">Hesap</span>
              <span className="flex-1 text-sm text-gray-100 dark:text-gray-100 font-mono truncate">
                {item.gameKey.steamUsername || "—"}
              </span>
              <CopyBtn
                value={item.gameKey.steamUsername || ""}
                copied={copied === "user"}
                onCopy={() => copy("user", item.gameKey.steamUsername || "")}
              />
            </div>
            {/* Şifre */}
            <div className="flex items-center gap-2 bg-[#0a0a0a] dark:bg-gray-800 rounded-xl px-3 py-2">
              <span className="text-[11px] font-semibold text-gray-500 uppercase w-12">Şifre</span>
              <span className="flex-1 text-sm text-gray-100 dark:text-gray-100 font-mono truncate">
                {showPass ? item.gameKey.steamPassword || "—" : "••••••••"}
              </span>
              <button
                onClick={() => setShowPass((s) => !s)}
                title={showPass ? "Gizle" : "Göster"}
                className="p-1.5 text-gray-500 hover:text-gray-200 dark:hover:text-gray-200 rounded-lg transition flex-shrink-0"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <CopyBtn
                value={item.gameKey.steamPassword || ""}
                copied={copied === "pass"}
                onCopy={() => copy("pass", item.gameKey.steamPassword || "")}
              />
            </div>

            {item.gameKey.accountNote && (
              <p className="text-xs text-gray-500 px-1">{item.gameKey.accountNote}</p>
            )}

            {/* Guard kodu */}
            {item.gameKey.hasGuard && (
              <div className="pt-1">
                {!guard ? (
                  <button
                    onClick={fetchGuard}
                    disabled={guardLoading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-medium transition disabled:opacity-60"
                  >
                    <Shield size={15} />
                    {guardLoading ? "Üretiliyor..." : "Guard Kodu Al"}
                  </button>
                ) : (
                  <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-2xl font-black tracking-[0.25em] text-blue-700 dark:text-blue-300 select-all">
                        {guard.code}
                      </p>
                      <CopyBtn value={guard.code} copied={copied === "guard"} onCopy={() => copy("guard", guard.code)} />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                          style={{ width: `${(guard.secsLeft / 30) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-blue-600 dark:text-blue-300 font-mono w-7 text-right">
                        {guard.secsLeft}s
                      </span>
                    </div>
                  </div>
                )}
                {guardError && <p className="text-[#FFF785] text-xs mt-1.5">{guardError}</p>}
              </div>
            )}
          </div>
        ) : (
          // Klasik anahtar teslimi
          <div className="mt-3">
            <div className="flex items-center gap-2 bg-[#0a0a0a] dark:bg-gray-800 rounded-xl px-3 py-2">
              <KeyRound size={14} className="text-gray-500 flex-shrink-0" />
              <span className="flex-1 text-sm text-gray-100 dark:text-gray-100 font-mono truncate">
                {item.gameKey.key || "—"}
              </span>
              <CopyBtn
                value={item.gameKey.key || ""}
                copied={copied === "key"}
                onCopy={() => copy("key", item.gameKey.key || "")}
              />
            </div>
          </div>
        )}

        <p className="text-[11px] text-gray-600 dark:text-gray-600 mt-3">
          {new Date(item.claimedAt).toLocaleDateString("tr-TR")} ·{" "}
          {item.source === "purchase" ? "Satın alındı" : "Aktivasyon"}
        </p>
      </div>
    </div>
  );
}
