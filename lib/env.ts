// Basit env validation. Production'da @t3-oss/env-nextjs + zod önerilir.
// Burası boot-time'da çalışır; eksik kritik env'de console.warn ile uyarır.

interface EnvSpec {
  DATABASE_URL: string;
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string;
  SHOPIER_API_KEY?: string;
  SHOPIER_API_SECRET?: string;
  SMTP_HOST?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  LOW_STOCK_THRESHOLD?: string;
  SENTRY_DSN?: string;
  UPSTASH_REDIS_URL?: string;
  UPSTASH_REDIS_TOKEN?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN?: string;
  NEXT_PUBLIC_TAWK_PROPERTY_ID?: string;
  NEXT_PUBLIC_TAWK_WIDGET_ID?: string;
}

const REQUIRED: (keyof EnvSpec)[] = ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL"];

const warnings: string[] = [];
for (const k of REQUIRED) {
  if (!process.env[k]) warnings.push(`Eksik kritik env: ${k}`);
}

// Production'da Shopier zorunlu
if (process.env.NODE_ENV === "production") {
  for (const k of ["SHOPIER_API_KEY", "SHOPIER_API_SECRET"] as const) {
    if (!process.env[k]) warnings.push(`Production'da eksik: ${k}`);
  }
}

if (warnings.length && process.env.NODE_ENV !== "test") {
  console.warn("[env] " + warnings.join(" | "));
}

export const env = process.env as unknown as EnvSpec;

export const hasSentry = !!env.SENTRY_DSN;
export const hasUpstash = !!env.UPSTASH_REDIS_URL && !!env.UPSTASH_REDIS_TOKEN;
export const hasCloudinary = !!env.CLOUDINARY_CLOUD_NAME && !!env.CLOUDINARY_API_KEY && !!env.CLOUDINARY_API_SECRET;
export const hasPlausible = !!env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
export const hasTawk = !!env.NEXT_PUBLIC_TAWK_PROPERTY_ID && !!env.NEXT_PUBLIC_TAWK_WIDGET_ID;
