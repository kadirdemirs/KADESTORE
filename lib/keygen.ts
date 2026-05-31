type KeyFormat = "steam" | "standard" | "short" | "custom";

interface KeyGenOptions {
  format?: KeyFormat;
  prefix?: string;
  count?: number;
}

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomSegment(len: number): string {
  let s = "";
  for (let i = 0; i < len; i++) {
    s += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return s;
}

export function generateKey(format: KeyFormat = "steam", prefix?: string): string {
  switch (format) {
    case "steam":
      // XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
      return [randomSegment(5), randomSegment(5), randomSegment(5), randomSegment(5), randomSegment(5)].join("-");
    case "standard":
      // XXXXX-XXXXX-XXXXX-XXXXX
      return [randomSegment(5), randomSegment(5), randomSegment(5), randomSegment(5)].join("-");
    case "short":
      // XXXXX-XXXXX-XXXXX
      return [randomSegment(5), randomSegment(5), randomSegment(5)].join("-");
    case "custom":
      if (prefix) {
        const pfx = prefix.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
        return `${pfx}-${randomSegment(5)}-${randomSegment(5)}-${randomSegment(5)}`;
      }
      return [randomSegment(5), randomSegment(5), randomSegment(5), randomSegment(5)].join("-");
    default:
      return [randomSegment(5), randomSegment(5), randomSegment(5), randomSegment(5)].join("-");
  }
}

export function generateKeys(count: number, format: KeyFormat = "steam", prefix?: string): string[] {
  const keys: string[] = [];
  const seen = new Set<string>();
  let attempts = 0;
  while (keys.length < count && attempts < count * 10) {
    const k = generateKey(format, prefix);
    if (!seen.has(k)) {
      seen.add(k);
      keys.push(k);
    }
    attempts++;
  }
  return keys;
}

export const KEY_FORMATS: { value: KeyFormat; label: string; example: string }[] = [
  { value: "steam", label: "Steam Format (5x5)", example: "ABCDE-FGHJK-LMNPQ-RSTVW-XYZAB" },
  { value: "standard", label: "Standart (4x5)", example: "ABCDE-FGHJK-LMNPQ-RSTVW" },
  { value: "short", label: "Kısa (3x5)", example: "ABCDE-FGHJK-LMNPQ" },
  { value: "custom", label: "Özel Ön Ek", example: "PREFIX-ABCDE-FGHJK-LMNPQ" },
];
