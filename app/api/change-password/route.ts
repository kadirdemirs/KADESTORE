import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { rateLimit } from "@/lib/rate-limit";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { ok } = rateLimit(`pw-change:${ip}`, 5, 15 * 60 * 1000);
  if (!ok) return NextResponse.json({ error: "Çok fazla deneme. 15 dakika bekleyin." }, { status: 429 });

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
  if (newPassword.length < 6) return NextResponse.json({ error: "Yeni şifre en az 6 karakter olmalıdır." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return NextResponse.json({ error: "Mevcut şifre yanlış." }, { status: 400 });

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

  // E-posta bildirimi gönder
  sendPasswordResetEmail({ to: user.email, name: user.name, newPassword: "" }).catch(() => {});

  return NextResponse.json({ success: true });
}
