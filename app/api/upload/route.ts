import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File;
  if (!file) return NextResponse.json({ error: "Dosya seçilmedi." }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "Sadece JPG, PNG, WebP, GIF desteklenir." }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "Dosya 5MB'ı geçemez." }, { status: 400 });

  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/${name}` });
}
