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
    openGraph: {
      title: `${game.title} | KadeStore`,
      description: game.description,
      images: game.imageUrl ? [{ url: game.imageUrl, width: 1200, height: 630, alt: game.title }] : [],
      url: `${appUrl}/games/${slug}`,
    },
    twitter: { card: "summary_large_image", title: game.title, description: game.description, images: game.imageUrl ? [game.imageUrl] : [] },
  };
}

export default async function GameDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-950">
      <Header />
      <GameDetailClient slug={slug} />
      <Footer />
    </div>
  );
}
