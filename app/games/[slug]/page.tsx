import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GameDetailClient from "@/components/GameDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const game = await prisma.game.findUnique({ where: { slug } });
  if (!game) return { title: "Oyun Bulunamadı" };
  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return {
    title: game.title,
    description: game.description,
    alternates: { canonical: `${appUrl}/games/${slug}` },
    openGraph: {
      title: `${game.title} | KadeStore`,
      description: game.description,
      images: game.imageUrl ? [{ url: game.imageUrl, width: 600, height: 900, alt: game.title }] : [],
      url: `${appUrl}/games/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: game.title,
      description: game.description,
      images: game.imageUrl ? [game.imageUrl] : [],
    },
  };
}

export default async function GameDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await prisma.game.findUnique({
    where: { slug },
    include: { _count: { select: { keys: { where: { isUsed: false } } } } },
  });
  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  // JSON-LD Product structured data (Google Shopping / Rich results)
  const jsonLd = game
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: game.title,
        description: game.description,
        image: game.imageUrl || undefined,
        sku: game.id,
        brand: { "@type": "Brand", name: game.platform },
        category: game.genre,
        offers: {
          "@type": "Offer",
          url: `${appUrl}/games/${slug}`,
          priceCurrency: "TRY",
          price: game.price.toFixed(2),
          availability:
            game._count.keys > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          seller: { "@type": "Organization", name: "KadeStore" },
        },
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Header />
      <GameDetailClient slug={slug} />
      <Footer />
    </div>
  );
}
