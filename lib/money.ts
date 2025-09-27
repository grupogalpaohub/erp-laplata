/**
 * Utilitários para conversão de moeda
 * Regra de ouro: estado e payload sempre em centavos (number);
 * usar formatBRL(x/100) só para exibir.
 */

/**
 * Converte string de moeda brasileira para centavos
 * Ex: "R$ 123,45" → 12345
 */
export const parseBRLToCents = (txt: string): number => {
  const onlyNums = txt.replace(/[^\d,,-.]/g, "").replace(/\./g, "").replace(",", ".");
  const val = Number(onlyNums);
  return Number.isFinite(val) ? Math.round(val * 100) : 0;
};

/**
 * Converte número para centavos
 * Ex: 123.45 → 12345
 */
export const cents = (n: number) => Math.round(n * 100);

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

/**
 * Converte número para centavos (alias para cents)
 */
export const toCents = (n: number) => Math.round(n * 100);

/**
 * Formata valor em centavos para moeda brasileira
 */
export const formatBRL = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};