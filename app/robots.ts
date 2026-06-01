import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXTAUTH_URL || "https://kadestore.vercel.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/profile", "/siparislerim", "/favoriler", "/sepet", "/redeem", "/guard", "/steam-guard", "/change-password"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
