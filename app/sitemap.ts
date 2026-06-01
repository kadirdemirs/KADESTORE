import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const STATIC_ROUTES = [
  "",
  "/games",
  "/rewards",
  "/sepet",
  "/iletisim",
  "/login",
  "/register",
  "/forgot-password",
  "/mesafeli-satis",
  "/on-bilgilendirme",
  "/kvkk",
  "/cerez-politikasi",
  "/privacy",
  "/terms",
  "/faq",
  "/yardim",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL || "https://kadestore.vercel.app";
  const now = new Date();

  const games = await prisma.game.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  }).catch(() => []);

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${base}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1.0 : 0.7,
    })),
    ...games.map((g) => ({
      url: `${base}/games/${g.slug}`,
      lastModified: g.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
