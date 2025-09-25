// lib/money.ts
const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function toCents(input: string | number | null | undefined): number {
  if (input === null || input === undefined) return 0;
  if (typeof input === "number") return Math.round(input * 100);
  let s = String(input).trim();
  if (!s) return 0;
  s = s.replace(/\./g, "").replace(",", ".");
  const n = Number(s);
  return Number.isNaN(n) ? 0 : Math.round(n * 100);
}

export function formatBRL(cents?: number | null): string {
  const v = typeof cents === "number" ? cents : 0;
  return BRL.format(v / 100);
}