// ============================================================================
// HELPER CANÔNICO E ÚNICO PARA CONVERSÃO DE MOEDA
// ============================================================================
// Este arquivo é a ÚNICA fonte de verdade para conversão de moeda
// TODOS os outros arquivos devem usar estas funções

/**
 * Converte valor em reais para centavos
 * @param input - Valor em reais (string ou number)
 * @returns Valor em centavos (number)
 * 
 * Exemplos:
 * - toCents("100,50") → 10050
 * - toCents("1.000,00") → 100000
 * - toCents(100.50) → 10050
 */
export function toCents(input: string | number): number {
  if (typeof input === 'number') {
    return Math.round(input * 100)
  }
  
  // Remove pontos de milhares e substitui vírgula por ponto
  const cleanValue = String(input)
    .replace(/\./g, '') // Remove pontos de milhares
    .replace(',', '.')  // Substitui vírgula por ponto decimal
  
  const numericValue = parseFloat(cleanValue)
  
  if (isNaN(numericValue)) {
    console.warn(`Valor inválido para conversão: ${input}`)
    return 0
  }
  
  return Math.round(numericValue * 100)
}

/**
 * Converte centavos para reais e formata como moeda brasileira
 * @param cents - Valor em centavos (number)
 * @returns String formatada como moeda (ex: "R$ 100,50")
 */
export function formatBRL(cents?: number | null): string {
  if (typeof cents !== 'number' || isNaN(cents)) {
    return 'R$ 0,00'
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(cents / 100)
}

/**
 * Converte centavos para número em reais
 * @param cents - Valor em centavos (number)
 * @returns Número em reais (number)
 */
export function centsToReais(cents: number): number {
  return cents / 100
}

/**
 * Alias para centsToReais (compatibilidade)
 * @param cents - Valor em centavos (number)
 * @returns Número em reais (number)
 */
export function toReais(cents: number): number {
  return centsToReais(cents)
}

/**
 * Converte reais para centavos (alias para toCents)
 * @param reais - Valor em reais (string ou number)
 * @returns Valor em centavos (number)
 */
export function reaisToCents(reais: string | number): number {
  return toCents(reais)
}

// ============================================================================
// VALIDAÇÕES E TESTES
// ============================================================================

/**
 * Valida se um valor está em formato de moeda válido
 * @param value - Valor a ser validado
 * @returns true se válido, false caso contrário
 */
export function isValidCurrency(value: string | number): boolean {
  if (typeof value === 'number') {
    return !isNaN(value) && isFinite(value)
  }
  
  const cleanValue = String(value)
    .replace(/\./g, '')
    .replace(',', '.')
  
  const numericValue = parseFloat(cleanValue)
  return !isNaN(numericValue) && isFinite(numericValue)
}

/**
 * Testa as funções de conversão
 * @returns Array com resultados dos testes
 */
export function testMoneyConversion(): Array<{input: any, expected: number, actual: number, passed: boolean}> {
  const tests = [
    { input: "100,50", expected: 10050 },
    { input: "1.000,00", expected: 100000 },
    { input: "0,01", expected: 1 },
    { input: 100.50, expected: 10050 },
    { input: "0", expected: 0 },
    { input: "", expected: 0 },
    { input: "invalid", expected: 0 }
  ]
  
  return tests.map(test => {
    const actual = toCents(test.input)
    const passed = actual === test.expected
    return { ...test, actual, passed }
  })
}
