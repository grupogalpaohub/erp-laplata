export function toCents(input: FormDataEntryValue | string | number | null | undefined): number {
  if (input == null) return 0;
  const s = String(input).replace(/[^\d.,-]/g, "").replace(".", "").replace(",", ".");
  const v = Number.isFinite(Number(s)) ? Number(s) : 0;
  return Math.round(v * 100);
}
export function formatBRL(cents?: number | null): string {
  const value = (cents ?? 0) / 100;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}