#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * TESTE RÁPIDO - VALIDA APENAS REGRAS CRÍTICAS
 * 
 * Executa apenas as validações mais importantes:
 * 1. Regras inegociáveis
 * 2. Padrões de moeda críticos
 * 3. Segurança crítica
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// ============================================================================
// VALIDAÇÃO RÁPIDA DE REGRAS CRÍTICAS
// ============================================================================

function validateCriticalRules() {
  console.log('🔒 VALIDANDO REGRAS CRÍTICAS...');
  
  const violations = [];
  const files = glob.sync('app/**/*.{ts,tsx}');
  
  for (const file of files) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // 1. SERVICE_ROLE_KEY no frontend (CRÍTICO) - excluir APIs e debug
      if (!file.includes('/api/') && !file.includes('\\api\\') && 
          !file.includes('/debug/') && !file.includes('\\debug\\') && 
          content.includes('SUPABASE_SERVICE_ROLE_KEY')) {
        violations.push({
          file,
          type: 'CRITICAL',
          message: 'SERVICE_ROLE_KEY no frontend',
          line: getLineNumber(content, 'SUPABASE_SERVICE_ROLE_KEY')
        });
      }
      
      // 2. Hardcode de tenant (CRÍTICO) - excluir setup e debug
      if (!file.includes('/setup/') && !file.includes('\\setup\\') && 
          !file.includes('/debug/') && !file.includes('\\debug\\') && 
          (content.includes("'LaplataLunaria'") || content.includes('"LaplataLunaria"'))) {
        violations.push({
          file,
          type: 'CRITICAL',
          message: 'Hardcode of tenant',
          line: getLineNumber(content, 'LaplataLunaria')
        });
      }
      
      // 3. Uso de *10000 ou /10000 (CRÍTICO)
      if (content.includes('* 10000') || content.includes('/ 10000')) {
        violations.push({
          file,
          type: 'CRITICAL',
          message: 'Uso de *10000 ou /10000',
          line: getLineNumber(content, '10000')
        });
      }
      
      // 4. toFixed(2) sobre centavos (CRÍTICO)
      if (content.includes('_cents') && content.includes('.toFixed(2)')) {
        violations.push({
          file,
          type: 'CRITICAL',
          message: 'toFixed(2) sobre centavos',
          line: getLineNumber(content, '.toFixed(2)')
        });
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
// FUNÇÃO PRINCIPAL
// ============================================================================

function main() {
  console.log('🚀 INICIANDO TESTE RÁPIDO...\n');
  
  const violations = validateCriticalRules();
  
  if (violations.length > 0) {
    console.log('❌ VIOLAÇÕES CRÍTICAS DETECTADAS:');
    violations.forEach(v => {
      console.log(`  ${v.file}:${v.line} - ${v.message}`);
    });
    
    console.log('\n🔧 CORREÇÕES NECESSÁRIAS:');
    console.log('  1. Remover SERVICE_ROLE_KEY do frontend');
    console.log('  2. Remover hardcode de tenant');
    console.log('  3. Usar toCents() e formatBRL()');
    console.log('  4. Nunca usar *10000 ou /10000');
    console.log('  5. Nunca usar toFixed(2) sobre centavos');
    
    process.exit(1);
  } else {
    console.log('✅ TESTE RÁPIDO APROVADO!');
    console.log('   - Sem SERVICE_ROLE_KEY no frontend');
    console.log('   - Sem hardcode de tenant');
    console.log('   - Padrões de moeda corretos');
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateCriticalRules };
