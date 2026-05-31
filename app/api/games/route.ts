import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const platform = searchParams.get("platform");
  const genre = searchParams.get("genre");
  const q = searchParams.get("q");
  const all = searchParams.get("all");

  if (slug) {
    const game = await prisma.game.findUnique({ where: { slug } });
    if (!game) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const keyCount = await prisma.gameKey.count({ where: { gameId: game.id, isUsed: false } });
    return NextResponse.json({ game, keyCount });
  }

  const games = await prisma.game.findMany({
    where: {
      ...(all !== "1" && { isActive: true }),
      ...(platform && { platform }),
      ...(genre && { genre }),
      ...(q && { title: { contains: q } }),
    },
    include: {
      _count: { select: { keys: { where: { isUsed: false } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ games });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { title, description, platform, genre, price, imageUrl, isActive, isFeatured, deliveryType } = body;
  if (!title || !description || !genre || !price) {
    return NextResponse.json({ error: "Eksik alan" }, { status: 400 });
  }
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
  const game = await prisma.game.create({
    data: { title, slug, description, platform: platform || "Steam", genre, price: parseFloat(price), imageUrl: imageUrl || "", isActive: isActive ?? true, isFeatured: isFeatured ?? false, deliveryType: deliveryType === "account" ? "account" : "key" },
  });
  return NextResponse.json({ game }, { status: 201 });
}
