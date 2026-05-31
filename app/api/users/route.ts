import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { rateLimit } from "@/lib/rate-limit";
import { sendWelcomeEmail } from "@/lib/email";

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
  if (password.length < 6) return NextResponse.json({ error: "Şifre en az 6 karakter olmalı." }, { status: 400 });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Bu e-posta zaten kayıtlı." }, { status: 409 });
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, password: hashed } });
  sendWelcomeEmail({ to: user.email, name: user.name }).catch(() => {});
  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
}
