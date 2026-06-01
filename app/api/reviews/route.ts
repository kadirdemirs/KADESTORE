import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");
  if (!gameId) return NextResponse.json({ error: "gameId gerekli" }, { status: 400 });

  const reviews = await prisma.review.findMany({
    where: { gameId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;
  return NextResponse.json({ reviews, average: Number(avg.toFixed(2)), count: reviews.length });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Kullanıcı yok" }, { status: 404 });

  const { gameId, rating, comment } = await req.json();
  if (!gameId || !rating || !comment) return NextResponse.json({ error: "Eksik alan" }, { status: 400 });
  if (rating < 1 || rating > 5) return NextResponse.json({ error: "Puan 1-5 arasında olmalı" }, { status: 400 });
  if (comment.length < 5 || comment.length > 1000) {
    return NextResponse.json({ error: "Yorum 5-1000 karakter olmalı" }, { status: 400 });
  }

  // Sadece bu oyunu satın almış olanlar yorum yazabilir
  const owned = await prisma.userKey.findFirst({
    where: { userId: user.id, gameKey: { gameId } },
  });
  if (!owned) {
    return NextResponse.json({ error: "Yorum için bu oyunu satın almış olmalısınız." }, { status: 403 });
  }

  // Tek yorum (kullanıcı başına)
  const existing = await prisma.review.findFirst({ where: { userId: user.id, gameId } });
  if (existing) {
    const updated = await prisma.review.update({
      where: { id: existing.id },
      data: { rating, comment },
    });
    return NextResponse.json({ review: updated, updated: true });
  }

  const review = await prisma.review.create({
    data: { userId: user.id, gameId, rating, comment },
  });
  return NextResponse.json({ review, updated: false }, { status: 201 });
}
