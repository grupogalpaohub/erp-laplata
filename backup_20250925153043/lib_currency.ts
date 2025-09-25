// ============================================================================
// WRAPPER PARA COMPATIBILIDADE - USA O HELPER CANÔNICO
// ============================================================================
// Este arquivo mantém compatibilidade com código existente
// mas delega TODAS as operações para lib/money.ts

import { 
  formatBRL as moneyFormatBRL, 
  toCents as moneyToCents, 
  centsToReais, 
  reaisToCents, 
  isValidCurrency 
} from './money'

/**
 * @deprecated Use formatBRL from lib/money.ts
 */
export function formatCurrency(cents: number): string {
  return moneyFormatBRL(cents)
}

/**
 * @deprecated Use toCents from lib/money.ts
 */
export function toCents(value: string | number): number {
  return moneyToCents(value)
}

/**
 * @deprecated Use centsToReais from lib/money.ts
 */
export function toReais(cents: number): number {
  return centsToReais(cents)
}

// Re-exportar funções canônicas para facilitar migração
export { 
  formatBRL, 
  toCents as moneyToCents, 
  centsToReais, 
  reaisToCents, 
  isValidCurrency 
} from './money'
