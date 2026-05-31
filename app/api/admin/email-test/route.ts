import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { testSmtp } from "@/lib/email";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ok = await testSmtp();
  return NextResponse.json({ ok, message: ok ? "SMTP bağlantısı başarılı." : "SMTP bağlantısı başarısız. .env ayarlarını kontrol edin." });
}
