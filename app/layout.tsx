import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";
import PWARegister from "@/components/PWARegister";
import SecurityNotice from "@/components/SecurityNotice";
import CookieBanner from "@/components/CookieBanner";
import Analytics from "@/components/Analytics";
import LiveChat from "@/components/LiveChat";
import CampaignBanner from "@/components/CampaignBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", weight: ["400", "600", "700", "800", "900"], display: "swap" });

const APP_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: { default: "KadeStore — Dijital Oyunlarda En İyi Adres", template: "%s | KadeStore" },
  description: "Uygun fiyatlar, anında teslimat ve kesintisiz destek ile oyun deneyiminizi bir üst seviyeye taşıyın.",
  keywords: ["dijital oyun", "steam key", "oyun anahtarı", "ucuz oyun", "kadestore"],
  authors: [{ name: "KadeStore" }],
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: APP_URL,
    siteName: "KadeStore",
    title: "KadeStore — Dijital Oyunlarda En İyi Adres",
    description: "500+ oyun, anında teslimat, güvenli alışveriş.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "KadeStore" }],
  },
  twitter: { card: "summary_large_image", title: "KadeStore", description: "Dijital oyun mağazası" },
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "KadeStore" },
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`dark ${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="bg-[#0a0a0a] text-gray-100 antialiased">
        <ThemeProvider>
          <PWARegister />
          <SessionWrapper>
            <CampaignBanner />
            {children}
          </SessionWrapper>
          <CookieBanner />
          <SecurityNotice />
          <Analytics />
          <LiveChat />
        </ThemeProvider>
      </body>
    </html>
  );
}
