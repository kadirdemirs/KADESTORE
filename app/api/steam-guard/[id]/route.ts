import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const { id } = await params;

  const account = await prisma.steamAccount.findUnique({ where: { id } });
  if (!account || account.userId !== user?.id) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }

  await prisma.steamAccount.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
