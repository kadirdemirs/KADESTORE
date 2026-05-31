import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function adminCheck(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") return false;
  return true;
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const game = await prisma.game.findUnique({
    where: { id },
    include: { _count: { select: { keys: { where: { isUsed: false } } } } },
  });
  if (!game) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ game });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await adminCheck(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const game = await prisma.game.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      platform: body.platform,
      genre: body.genre,
      price: parseFloat(body.price),
      imageUrl: body.imageUrl,
      isActive: body.isActive,
      isFeatured: body.isFeatured,
    },
  });
  return NextResponse.json({ game });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await adminCheck(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.game.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
