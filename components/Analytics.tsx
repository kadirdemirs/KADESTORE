// Plausible analytics — sadece kullanıcı pazarlama çerezini kabul ettiyse yüklenir.
"use client";
import Script from "next/script";
import { useEffect, useState } from "react";

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default function Analytics() {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem("kadestore.cookieConsent");
    setConsent(v === "all");
    const handler = (e: any) => setConsent(e.detail === "all");
    window.addEventListener("cookieConsent", handler);
    return () => window.removeEventListener("cookieConsent", handler);
  }, []);

  if (!PLAUSIBLE_DOMAIN || !consent) return null;

  return (
    <Script
      defer
      data-domain={PLAUSIBLE_DOMAIN}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
