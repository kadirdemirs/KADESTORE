import { hasUpstash, env } from "./env";

// In-memory store (single instance only — Vercel'de instance başına ayrı).
const store = new Map<string, { count: number; resetAt: number }>();

function memoryRateLimit(key: string, limit: number, windowMs: number): { ok: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  entry.count++;
  if (entry.count > limit) return { ok: false, remaining: 0 };
  return { ok: true, remaining: limit - entry.count };
}

// Upstash Redis (sliding-window). UPSTASH_REDIS_URL ve TOKEN eklenince aktif.
async function upstashRateLimit(key: string, limit: number, windowMs: number): Promise<{ ok: boolean; remaining: number }> {
  try {
    const now = Date.now();
    const windowStart = now - windowMs;
    const luaKey = `rl:${key}`;
    const res = await fetch(`${env.UPSTASH_REDIS_URL}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.UPSTASH_REDIS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["ZREMRANGEBYSCORE", luaKey, 0, windowStart],
        ["ZADD", luaKey, now, `${now}-${Math.random()}`],
        ["ZCARD", luaKey],
        ["PEXPIRE", luaKey, windowMs],
      ]),
    });
    const data = await res.json();
    const count = data?.[2]?.result ?? 0;
    return { ok: count <= limit, remaining: Math.max(0, limit - count) };
  } catch (e) {
    console.warn("Upstash rate-limit fallback to memory:", e);
    return memoryRateLimit(key, limit, windowMs);
  }
}

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; remaining: number } {
  // NextAuth authorize gibi senkron yerlerde memory kullan
  return memoryRateLimit(key, limit, windowMs);
}

export async function rateLimitAsync(key: string, limit: number, windowMs: number) {
  if (hasUpstash) return upstashRateLimit(key, limit, windowMs);
  return memoryRateLimit(key, limit, windowMs);
}

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of store.entries()) {
    if (v.resetAt < now) store.delete(k);
  }
}, 60 * 60 * 1000);
