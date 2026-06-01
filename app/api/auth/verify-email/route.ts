import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "Token eksik" }, { status: 400 });

  const user = await prisma.user.findFirst({
    where: { emailVerifyToken: token } as any,
  });

  if (!user) {
    return NextResponse.json({ error: "Geçersiz doğrulama bağlantısı." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, emailVerifyToken: null } as any,
  });

  return NextResponse.json({ success: true });
}
