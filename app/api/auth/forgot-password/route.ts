import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetLink } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { ok } = rateLimit(`forgot:${ip}`, 5, 60 * 60 * 1000);
  if (!ok) {
    return NextResponse.json({ error: "Çok fazla deneme. 1 saat bekleyin." }, { status: 429 });
  }

  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "E-posta gerekli" }, { status: 400 });

  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  // E-posta enumeration koruması: kullanıcı yoksa da başarı dön
  if (!user) {
    return NextResponse.json({ success: true, message: "E-posta gönderildi (kayıtlıysa)." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 dk

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: token,
      passwordResetExpires: expires,
    } as any,
  });

  sendPasswordResetLink({ to: user.email, name: user.name, token }).catch(console.error);

  return NextResponse.json({ success: true, message: "E-posta gönderildi (kayıtlıysa)." });
}
