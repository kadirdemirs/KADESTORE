export function rankFromPoints(points: number): string {
  if (points >= 60) return "Elite";
  if (points >= 50) return "Diamond";
  if (points >= 40) return "Platinum";
  if (points >= 30) return "Gold";
  if (points >= 20) return "Silver";
  if (points >= 10) return "Bronze";
  return "none";
}

export const RANKS = [
  { name: "Bronze", required: 10, bonus: 1 },
  { name: "Silver", required: 20, bonus: 5 },
  { name: "Gold", required: 30, bonus: 10 },
  { name: "Platinum", required: 40, bonus: 15 },
  { name: "Diamond", required: 50, bonus: 20 },
  { name: "Elite", required: 60, bonus: 25 },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(price);
}

export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}
