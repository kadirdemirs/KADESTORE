import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { rateLimit } from "@/lib/rate-limit";
import { sendWelcomeEmail } from "@/lib/email";
import { BCRYPT_ROUNDS } from "@/lib/auth";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, points: true, rank: true, createdAt: true, _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { ok } = rateLimit(`register:${ip}`, 5, 60 * 60 * 1000);
  if (!ok) return NextResponse.json({ error: "Çok fazla kayıt denemesi. 1 saat bekleyin." }, { status: 429 });

  const body = await req.json();
  const { name, email, password } = body;
  if (!name || !email || !password) return NextResponse.json({ error: "Eksik alan" }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Şifre en az 8 karakter olmalı." }, { status: 400 });
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    return NextResponse.json({ error: "Şifre büyük harf, küçük harf ve rakam içermelidir." }, { status: 400 });
  }
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  // E-posta enumeration koruması: var olan kullanıcıyı da var-yok belirtmeden başarılı dön
  if (existing) {
    return NextResponse.json({ user: { email: normalizedEmail }, message: "Kayıt isteği alındı." }, { status: 201 });
  }
  const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const verifyToken = crypto.randomBytes(32).toString("hex");
  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      password: hashed,
      emailVerified: false,
      emailVerifyToken: verifyToken,
    } as any,
  });
  sendWelcomeEmail({ to: user.email, name: user.name, verifyToken }).catch(() => {});
  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
}
