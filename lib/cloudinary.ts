// Cloudinary upload helper. CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET env eklenince aktif.
import { hasCloudinary, env } from "./env";
import crypto from "crypto";

export async function uploadToCloudinary(file: Buffer | Blob, folder = "kadestore"): Promise<{ url: string; publicId: string }> {
  if (!hasCloudinary) {
    throw new Error("Cloudinary env değişkenleri eksik. Local upload kullanılıyor.");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`;
  const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

  const formData = new FormData();
  if (Buffer.isBuffer(file)) {
    formData.append("file", new Blob([new Uint8Array(file)]));
  } else {
    formData.append("file", file);
  }
  formData.append("api_key", env.CLOUDINARY_API_KEY!);
  formData.append("timestamp", String(timestamp));
  formData.append("folder", folder);
  formData.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Cloudinary ${res.status}: ${txt}`);
  }
  const data = await res.json();
  return { url: data.secure_url, publicId: data.public_id };
}

export const cloudinaryEnabled = hasCloudinary;
