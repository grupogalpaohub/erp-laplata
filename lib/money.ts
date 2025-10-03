/**
 * Utilitários para conversão de moeda
 * Regra de ouro: estado e payload sempre em centavos (number);
 * usar formatBRL(x/100) só para exibir.
 */

/**
 * Converte string/number para centavos com segurança (evita float glitches)
 * aceita "1.234,56", "1234.56", 1234.56, "R$ 1.234,56"
 */
export function toCents(input: string | number): number {
  const s = String(input)
    .replace(/\s/g, '')
    .replace(/[R$\u00A0]/g, '')
    .replace(/\./g, '')         // remove separador de milhar
    .replace(/,/g, '.')         // vírgula -> ponto
  const n = Number(s)
  if (Number.isNaN(n)) throw new Error('Valor inválido')
  return Math.round(n * 100)
}

/**
 * Formata valor em centavos para moeda brasileira
 * Ex: 12345 → "R$ 123,45"
 */
export function formatBRL(cents: number): string {
  const v = (cents ?? 0) / 100
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

/**
 * Converte string de moeda brasileira para centavos (legacy - usar toCents)
 * Ex: "R$ 123,45" → 12345
 */
export const parseBRLToCents = (txt: string): number => {
  return toCents(txt);
};

/**
 * Converte número para centavos (legacy - usar toCents)
 * Ex: 123.45 → 12345
 */
export const cents = (n: number) => toCents(n);

/**
 * Converte centavos para número decimal
 * Ex: 12345 → 123.45
 */
export const centsToDecimal = (cents: number) => cents / 100;

/**
 * Valida se um valor é um número válido de centavos
 */
export const isValidCents = (value: any): value is number => {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
};