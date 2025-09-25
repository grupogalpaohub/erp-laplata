#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * SCRIPT DE TESTE COMPLETO - EXECUTA TODOS OS GUARDRAILS E TESTES E2E
 * 
 * Executa em sequência:
 * 1. Validação de regras inegociáveis
 * 2. Validação de moeda
 * 3. Validação de segurança
 * 4. Testes E2E "como usuário"
 * 5. Relatório final
 */

const { runE2ETests } = require('./e2e-tester');
const { validateCurrencyPatterns, validateUICurrencyConsistency, validateKPIsAndTotals } = require('./currency-validator');
const { validateSecurityRules, validateAuthentication, validateRLS, validateMutations } = require('./security-validator');

// ============================================================================
// EXECUÇÃO DE TODOS OS TESTES
// ============================================================================

async function runAllTests(module = 'ALL') {
  console.log('🚀 INICIANDO BATERIA COMPLETA DE TESTES...\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    module,
    tests: {
      currency: { passed: false, violations: [] },
      security: { passed: false, violations: [] },
      e2e: { passed: false, results: [] }
    },
    overall: { passed: false, total: 0, passed: 0, failed: 0 }
  };
  
  try {
    // 1. VALIDAÇÃO DE MOEDA
    console.log('💰 VALIDANDO MOEDA...');
    try {
      const currencyViolations = validateCurrencyPatterns();
      const consistencyViolations = validateUICurrencyConsistency();
      const kpiViolations = validateKPIsAndTotals();
      
      const allCurrencyViolations = [...currencyViolations, ...consistencyViolations, ...kpiViolations];
      
      if (allCurrencyViolations.length > 0) {
        results.tests.currency.passed = false;
        results.tests.currency.violations = allCurrencyViolations;
        console.log(`❌ ${allCurrencyViolations.length} violações de moeda encontradas`);
      } else {
        results.tests.currency.passed = true;
        console.log('✅ Validação de moeda aprovada');
      }
    } catch (error) {
      results.tests.currency.passed = false;
      results.tests.currency.violations = [{ error: error.message }];
      console.log(`❌ Erro na validação de moeda: ${error.message}`);
    }
    
    // 2. VALIDAÇÃO DE SEGURANÇA
    console.log('\n🔒 VALIDANDO SEGURANÇA...');
    try {
      const securityViolations = validateSecurityRules();
      const authViolations = validateAuthentication();
      const rlsViolations = validateRLS();
      const mutationViolations = validateMutations();
      
      const allSecurityViolations = [...securityViolations, ...authViolations, ...rlsViolations, ...mutationViolations];
      
      if (allSecurityViolations.length > 0) {
        results.tests.security.passed = false;
        results.tests.security.violations = allSecurityViolations;
        console.log(`❌ ${allSecurityViolations.length} violações de segurança encontradas`);
      } else {
        results.tests.security.passed = true;
        console.log('✅ Validação de segurança aprovada');
      }
    } catch (error) {
      results.tests.security.passed = false;
      results.tests.security.violations = [{ error: error.message }];
      console.log(`❌ Erro na validação de segurança: ${error.message}`);
    }
    
    // 3. TESTES E2E "COMO USUÁRIO"
    console.log('\n🧪 EXECUTANDO TESTES E2E...');
    try {
      await runE2ETests(module);
      results.tests.e2e.passed = true;
      console.log('✅ Testes E2E aprovados');
    } catch (error) {
      results.tests.e2e.passed = false;
      results.tests.e2e.results = [{ error: error.message }];
      console.log(`❌ Erro nos testes E2E: ${error.message}`);
    }
    
    // 4. CALCULAR RESULTADO GERAL
    results.overall.total = 3;
    results.overall.passed = Object.values(results.tests).filter(t => t.passed).length;
    results.overall.failed = results.overall.total - results.overall.passed;
    results.overall.passed = results.overall.failed === 0;
    
    // 5. RELATÓRIO FINAL
    console.log('\n📊 RELATÓRIO FINAL:');
    console.log(`Total de testes: ${results.overall.total}`);
    console.log(`Aprovados: ${results.overall.passed}`);
    console.log(`Reprovados: ${results.overall.failed}`);
    console.log(`Taxa de sucesso: ${((results.overall.passed / results.overall.total) * 100).toFixed(1)}%`);
    
    if (results.overall.passed) {
      console.log('\n✅ TODOS OS TESTES APROVADOS!');
      console.log('🎉 ERP LaPlata está pronto para produção!');
    } else {
      console.log('\n❌ TESTES REPROVADOS - CORREÇÕES NECESSÁRIAS');
      
      if (!results.tests.currency.passed) {
        console.log('\n💰 VIOLAÇÕES DE MOEDA:');
        results.tests.currency.violations.forEach(v => {
          console.log(`  - ${v.file}:${v.line} - ${v.message}`);
        });
      }
      
      if (!results.tests.security.passed) {
        console.log('\n🔒 VIOLAÇÕES DE SEGURANÇA:');
        results.tests.security.violations.forEach(v => {
          console.log(`  - ${v.file}:${v.line} - ${v.message}`);
        });
      }
      
      if (!results.tests.e2e.passed) {
        console.log('\n🧪 ERROS NOS TESTES E2E:');
        results.tests.e2e.results.forEach(r => {
          console.log(`  - ${r.error}`);
        });
      }
    }
    
    // 6. SALVAR RELATÓRIO
    const fs = require('fs');
    const reportFile = `test-reports/complete-test-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(results, null, 2));
    console.log(`\n📄 Relatório completo salvo: ${reportFile}`);
    
    // 7. EXIT CODE
    if (!results.overall.passed) {
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ ERRO CRÍTICO DURANTE EXECUÇÃO DOS TESTES:', error.message);
    process.exit(1);
  }
}

// ============================================================================
// EXECUÇÃO
// ============================================================================

if (require.main === module) {
  const module = process.argv[2] || 'ALL';
  runAllTests(module).catch(console.error);
}

module.exports = { runAllTests };
