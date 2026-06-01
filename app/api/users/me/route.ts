import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true, role: true, points: true, rank: true, createdAt: true },
  });
  return NextResponse.json({ user });
}

// Hesap silme — KVKK 7. madde kapsamında soft delete (anonimleştirme).
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });

  const pendingCount = await prisma.order.count({
    where: { userId: user.id, status: "pending" },
  });
  if (pendingCount > 0) {
    return NextResponse.json(
      { error: "Bekleyen siparişiniz var. Lütfen önce tamamlayın ya da iptal edin." },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    (prisma as any).wishlist.deleteMany({ where: { userId: user.id } }),
    (prisma as any).stockAlert.deleteMany({ where: { userId: user.id } }),
    prisma.couponUsage.deleteMany({ where: { userId: user.id } }),
    prisma.review.deleteMany({ where: { userId: user.id } }),
    // userKeys + orders KVKK 10 yıl saklama için kalır; sadece kullanıcı verisi anonimleşir
    prisma.user.update({
      where: { id: user.id },
      data: {
        email: `silinmis-${user.id}@deleted.local`,
        name: "Silinmiş Kullanıcı",
        password: "DELETED",
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
