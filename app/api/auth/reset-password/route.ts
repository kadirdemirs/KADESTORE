import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { BCRYPT_ROUNDS } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || !password) return NextResponse.json({ error: "Eksik alan" }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Şifre en az 8 karakter olmalı." }, { status: 400 });
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    return NextResponse.json({ error: "Şifre büyük harf, küçük harf ve rakam içermelidir." }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: { gt: new Date() },
    } as any,
  });

  if (!user) {
    return NextResponse.json({ error: "Geçersiz veya süresi dolmuş bağlantı." }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      passwordResetToken: null,
      passwordResetExpires: null,
    } as any,
  });

  return NextResponse.json({ success: true });
}
