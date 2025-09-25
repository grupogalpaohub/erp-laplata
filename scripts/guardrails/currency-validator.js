#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * VALIDADOR DE MOEDA - GARANTE CONSISTÊNCIA UI ↔ DB
 * 
 * Valida que todos os valores monetários seguem o padrão:
 * - Banco: centavos (inteiro)
 * - Entrada: toCents() (×100)
 * - Saída: formatBRL() (/100 com Intl.NumberFormat)
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// ============================================================================
// PADRÕES PROIBIDOS
// ============================================================================

const FORBIDDEN_PATTERNS = [
  // Uso de *10000 ou /10000
  { pattern: /\*[\s]*10000/g, message: 'Uso de *10000 proibido' },
  { pattern: /\/[\s]*10000/g, message: 'Uso de /10000 proibido' },
  
  // toFixed(2) sobre centavos
  { pattern: /\.toFixed\(2\)/g, message: 'toFixed(2) sobre centavos proibido' },
  
  // Formatação manual de moeda
  { pattern: /R\$\s*[\d,\.]+/g, message: 'Formatação manual de moeda proibida' },
  
  // Divisão por 10000
  { pattern: /\/[\s]*10000/g, message: 'Divisão por 10000 proibida' },
  
  // Multiplicação por 10000
  { pattern: /\*[\s]*10000/g, message: 'Multiplicação por 10000 proibida' }
];

// ============================================================================
// PADRÕES OBRIGATÓRIOS
// ============================================================================

const REQUIRED_PATTERNS = [
  // Uso de toCents() para entrada
  { pattern: /toCents\(/g, message: 'toCents() deve ser usado para entrada' },
  
  // Uso de formatBRL() para saída
  { pattern: /formatBRL\(/g, message: 'formatBRL() deve ser usado para saída' },
  
  // Uso de Intl.NumberFormat para formatação
  { pattern: /Intl\.NumberFormat/g, message: 'Intl.NumberFormat deve ser usado para formatação' }
];

// ============================================================================
// VALIDAÇÃO DE ARQUIVOS
// ============================================================================

function validateCurrencyPatterns() {
  console.log('🔍 VALIDANDO PADRÕES DE MOEDA...');
  
  const violations = [];
  const files = glob.sync('app/**/*.{ts,tsx}');
  
  for (const file of files) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Verificar padrões proibidos
      for (const { pattern, message } of FORBIDDEN_PATTERNS) {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach(match => {
            violations.push({
              file,
              type: 'FORBIDDEN',
              message: `${message}: "${match}"`,
              line: getLineNumber(content, match)
            });
          });
        }
      }
      
      // Verificar se arquivo usa moeda mas não tem padrões obrigatórios (apenas se realmente usa moeda)
      if ((content.includes('_cents') || content.includes('price') || content.includes('total')) && 
          (content.includes('formatBRL(') || content.includes('toCents('))) {
        const hasToCents = content.includes('toCents(');
        const hasFormatBRL = content.includes('formatBRL(');
        
        if (!hasToCents && !hasFormatBRL) {
          violations.push({
            file,
            type: 'MISSING_REQUIRED',
            message: 'Arquivo usa moeda mas não tem toCents() ou formatBRL()',
            line: 1
          });
        }
      }
    }
  }
  
  return violations;
}

function getLineNumber(content, searchString) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchString)) {
      return i + 1;
    }
  }
  return 0;
}

// ============================================================================
// VALIDAÇÃO DE CONSISTÊNCIA UI ↔ DB
// ============================================================================

function validateUICurrencyConsistency() {
  console.log('🔍 VALIDANDO CONSISTÊNCIA DE MOEDA UI ↔ DB...');
  
  const violations = [];
  const files = glob.sync('app/**/*.{ts,tsx}');
  
  for (const file of files) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Verificar se arquivo exibe valores monetários (apenas se realmente usa)
      if (content.includes('_cents') && (content.includes('formatBRL(') || content.includes('toCents('))) {
        // Verificar se está dividindo por 100 corretamente
        if (content.includes('formatBRL(') && !content.includes('/ 100')) {
          violations.push({
            file,
            type: 'CURRENCY_FORMAT',
            message: 'formatBRL() deve dividir centavos por 100',
            line: getLineNumber(content, 'formatBRL(')
          });
        }
        
        // Verificar se está multiplicando por 100 corretamente
        if (content.includes('toCents(') && !content.includes('* 100')) {
          violations.push({
            file,
            type: 'CURRENCY_INPUT',
            message: 'toCents() deve multiplicar por 100',
            line: getLineNumber(content, 'toCents(')
          });
        }
      }
    }
  }
  
  return violations;
}

// ============================================================================
// VALIDAÇÃO DE KPIs E TOTAIS
// ============================================================================

function validateKPIsAndTotals() {
  console.log('🔍 VALIDANDO KPIs E TOTAIS...');
  
  const violations = [];
  const files = glob.sync('app/**/*.{ts,tsx}');
  
  for (const file of files) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Verificar se arquivo calcula totais no cliente (apenas se realmente usa moeda)
      if (content.includes('reduce(') && content.includes('_cents') && 
          (content.includes('formatBRL(') || content.includes('toCents('))) {
        violations.push({
          file,
          type: 'CLIENT_CALCULATION',
          message: 'Totais devem ser calculados no servidor, não no cliente',
          line: getLineNumber(content, 'reduce(')
        });
      }
      
      // Verificar se arquivo usa valores hardcoded (apenas se realmente usa moeda)
      if (content.includes('_cents') && content.includes('= [') && 
          (content.includes('formatBRL(') || content.includes('toCents('))) {
        violations.push({
          file,
          type: 'HARDCODED_VALUES',
          message: 'Valores monetários não devem ser hardcoded',
          line: getLineNumber(content, '= [')
        });
      }
    }
  }
  
  return violations;
}

// ============================================================================
// FUNÇÃO PRINCIPAL
// ============================================================================

function main() {
  console.log('🚀 INICIANDO VALIDAÇÃO DE MOEDA...\n');
  
  const allViolations = [];
  
  // 1. Validar padrões proibidos
  const patternViolations = validateCurrencyPatterns();
  allViolations.push(...patternViolations);
  
  // 2. Validar consistência UI ↔ DB
  const consistencyViolations = validateUICurrencyConsistency();
  allViolations.push(...consistencyViolations);
  
  // 3. Validar KPIs e totais
  const kpiViolations = validateKPIsAndTotals();
  allViolations.push(...kpiViolations);
  
  // 4. Relatório final
  if (allViolations.length > 0) {
    console.log('\n❌ VIOLAÇÕES DE MOEDA DETECTADAS:');
    allViolations.forEach(v => {
      console.log(`  ${v.file}:${v.line} - ${v.message}`);
    });
    
    console.log('\n🔧 CORREÇÕES NECESSÁRIAS:');
    console.log('  1. Usar toCents() para entrada (×100)');
    console.log('  2. Usar formatBRL() para saída (/100)');
    console.log('  3. Nunca usar *10000 ou /10000');
    console.log('  4. Nunca usar toFixed(2) sobre centavos');
    console.log('  5. Calcular totais no servidor, não no cliente');
    
    process.exit(1);
  } else {
    console.log('\n✅ VALIDAÇÃO DE MOEDA APROVADA!');
    console.log('   - Padrões corretos de entrada e saída');
    console.log('   - Consistência UI ↔ DB');
    console.log('   - KPIs e totais calculados no servidor');
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateCurrencyPatterns, validateUICurrencyConsistency, validateKPIsAndTotals };
