#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * SCRIPT ANTI-PREGUIÇA - INVESTIGAÇÃO PROFUNDA OBRIGATÓRIA
 * 
 * Este script força investigação profunda antes de qualquer correção.
 * Impede comportamento preguiçoso de assumir problemas sem verificar.
 */

const fs = require('fs');
const path = require('path');

function fail(msg) {
  console.error('\n❌ INVESTIGAÇÃO INSUFICIENTE:', msg);
  console.error('🔍 INVESTIGUE PROFUNDAMENTE ANTES DE CORRIGIR!');
  console.error('📋 VERIFIQUE:');
  console.error('   - Variáveis de ambiente existentes');
  console.error('   - Arquivos de configuração');
  console.error('   - Logs de erro detalhados');
  console.error('   - Fluxo completo de execução');
  console.error('   - Guardrails e regras estabelecidas\n');
  process.exit(1);
}

function checkEnvVariables() {
  console.log('🔍 INVESTIGANDO VARIÁVEIS DE AMBIENTE...');
  
  const envPath = '.env.local';
  if (!fs.existsSync(envPath)) {
    fail('Arquivo .env.local não encontrado - investigue se existe!');
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
    'NEXT_PUBLIC_AUTH_DISABLED',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  const missing = requiredVars.filter(v => !envContent.includes(v));
  if (missing.length > 0) {
    fail(`Variáveis ausentes no .env.local: ${missing.join(', ')}`);
  }
  
  console.log('✅ Variáveis de ambiente verificadas');
}

function checkFileConsistency() {
  console.log('🔍 INVESTIGANDO CONSISTÊNCIA DE ARQUIVOS...');
  
  const files = [
    'lib/env.ts',
    'lib/auth/requireSession.ts', 
    'middleware.ts',
    'lib/supabase/server.ts'
  ];
  
  for (const file of files) {
    if (!fs.existsSync(file)) {
      fail(`Arquivo crítico ausente: ${file}`);
    }
    
    const content = fs.readFileSync(file, 'utf8');
    
    // Verificar se usa variável correta
    if (file === 'lib/env.ts' && !content.includes('NEXT_PUBLIC_AUTH_DISABLED')) {
      fail(`lib/env.ts deve usar NEXT_PUBLIC_AUTH_DISABLED, não AUTH_DISABLED`);
    }
    
    if (file === 'middleware.ts' && content.includes('ENV')) {
      fail(`middleware.ts não pode importar lib/env (Edge Runtime)`);
    }
    
    if (content.includes('process.env.TENANT_ID') && !content.includes('// ❌ PROIBIDO')) {
      fail(`${file} usa process.env.TENANT_ID que não existe no .env.local`);
    }
  }
  
  console.log('✅ Consistência de arquivos verificada');
}

function checkGuardrails() {
  console.log('🔍 INVESTIGANDO GUARDRAILS...');
  
  const regressionsPath = 'scripts/guardrails/regressions.yml';
  if (!fs.existsSync(regressionsPath)) {
    fail('Arquivo de guardrails ausente');
  }
  
  const content = fs.readFileSync(regressionsPath, 'utf8');
  if (!content.includes('anti-lazy-investigation')) {
    fail('Guardrails anti-preguiça não implementados');
  }
  
  console.log('✅ Guardrails verificados');
}

function main() {
  console.log('🚀 INICIANDO INVESTIGAÇÃO PROFUNDA OBRIGATÓRIA...\n');
  
  try {
    checkEnvVariables();
    checkFileConsistency();
    checkGuardrails();
    
    console.log('\n✅ INVESTIGAÇÃO PROFUNDA CONCLUÍDA');
    console.log('🎯 Agora você pode corrigir com confiança!');
    
  } catch (error) {
    fail(`Erro durante investigação: ${error.message}`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkEnvVariables, checkFileConsistency, checkGuardrails };
