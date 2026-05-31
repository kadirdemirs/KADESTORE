import crypto from "crypto";

const STEAM_CHARS = "23456789BCDFGHJKMNPQRTVWXY";

export function getSteamGuardCode(sharedSecret: string): string {
  const secret = Buffer.from(sharedSecret.trim(), "base64");
  const time = Math.floor(Date.now() / 1000);
  const counter = Math.floor(time / 30);

  const buf = Buffer.alloc(8);
  buf.writeUInt32BE(Math.floor(counter / 0x100000000), 0);
  buf.writeUInt32BE(counter >>> 0, 4);

  const hmac = crypto.createHmac("sha1", secret).update(buf).digest();
  const offset = hmac[19] & 0xf;
  const code32 =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  let result = "";
  let remaining = code32;
  for (let i = 0; i < 5; i++) {
    result += STEAM_CHARS[remaining % STEAM_CHARS.length];
    remaining = Math.floor(remaining / STEAM_CHARS.length);
  }
  return result;
}

export function getSecondsRemaining(): number {
  return 30 - (Math.floor(Date.now() / 1000) % 30);
}

export function isValidSharedSecret(s: string): boolean {
  try {
    const buf = Buffer.from(s.trim(), "base64");
    return buf.length === 20;
  } catch {
    return false;
  }
}
