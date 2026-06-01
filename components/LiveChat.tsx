// Tawk.to canlı destek — sadece env tanımlıysa yüklenir.
"use client";
import { useEffect } from "react";

const PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
const WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;

export default function LiveChat() {
  useEffect(() => {
    if (!PROPERTY_ID || !WIDGET_ID) return;
    if (typeof window === "undefined") return;
    if ((window as any).Tawk_API) return;

    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    const s = document.createElement("script");
    s.async = true;
    s.src = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;
    s.charset = "UTF-8";
    s.setAttribute("crossorigin", "*");
    document.head.appendChild(s);
  }, []);

  return null;
}
