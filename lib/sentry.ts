// Sentry stub. SENTRY_DSN env eklenince @sentry/nextjs paketini kurup aktive edin:
// npm i @sentry/nextjs
// sentry.client.config.ts ve sentry.server.config.ts oluşturun (Sentry wizard yapacak).
// Şimdilik basit console-based fallback.

import { env } from "./env";

export function captureError(error: unknown, context?: Record<string, any>) {
  if (env.SENTRY_DSN) {
    // @ts-ignore — paket yüklendiğinde:
    // import * as Sentry from "@sentry/nextjs";
    // Sentry.captureException(error, { extra: context });
  }
  console.error("[error]", error, context);
}

export function captureMessage(message: string, context?: Record<string, any>) {
  if (env.SENTRY_DSN) {
    // @ts-ignore
    // Sentry.captureMessage(message, { extra: context });
  }
  console.warn("[msg]", message, context);
}
