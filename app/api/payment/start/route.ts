import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateShopierForm } from "@/lib/shopier";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });
  }

  const { gameId } = await req.json();
  if (!gameId) return NextResponse.json({ error: "gameId gerekli" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });

  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game || !game.isActive) {
    return NextResponse.json({ error: "Oyun bulunamadı" }, { status: 404 });
  }

  const keyCount = await prisma.gameKey.count({ where: { gameId, isUsed: false } });
  if (keyCount === 0) {
    return NextResponse.json({ error: "Bu oyun için stokta anahtar yok." }, { status: 400 });
  }

  // Bekleyen sipariş oluştur
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      gameId: game.id,
      price: game.price,
      status: "pending",
    },
  });

  const [firstName, ...rest] = user.name.split(" ");
  const lastName = rest.join(" ") || "Kullanıcı";

  const { actionUrl, fields } = generateShopierForm({
    orderId: order.id,
    productName: game.title,
    buyerName: firstName,
    buyerSurname: lastName,
    buyerEmail: user.email,
    totalPrice: game.price,
    callbackUrl: `${process.env.NEXTAUTH_URL}/api/payment/callback`,
  });

  return NextResponse.json({ actionUrl, fields, orderId: order.id });
}
