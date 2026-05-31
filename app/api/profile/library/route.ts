import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ library: [] });

  const library = await prisma.userKey.findMany({
    where: { userId: user.id },
    include: {
      gameKey: {
        include: { game: { select: { title: true, platform: true, genre: true, imageUrl: true, slug: true } } },
      },
    },
    orderBy: { claimedAt: "desc" },
  });

  return NextResponse.json({ library });
}
