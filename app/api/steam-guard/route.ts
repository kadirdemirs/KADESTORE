import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ accounts: [] });

  const accounts = await prisma.steamAccount.findMany({
    where: { userId: user.id },
    select: { id: true, label: true, sharedSecret: true, identitySecret: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ accounts });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });

  const { label, sharedSecret, identitySecret } = await req.json();
  if (!label || !sharedSecret) {
    return NextResponse.json({ error: "Hesap adı ve shared_secret zorunludur." }, { status: 400 });
  }

  const account = await prisma.steamAccount.create({
    data: {
      userId: user.id,
      label: label.trim(),
      sharedSecret: sharedSecret.trim(),
      identitySecret: identitySecret?.trim() || "",
    },
  });

  return NextResponse.json({ account }, { status: 201 });
}
