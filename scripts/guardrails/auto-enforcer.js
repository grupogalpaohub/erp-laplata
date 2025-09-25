#!/usr/bin/env node
// ENFORCER AUTOMÁTICO - EXECUTA A CADA COMANDO
const { execSync } = require('child_process');

try {
  execSync('node scripts/guardrails/enforce-rules.js', { stdio: 'inherit' });
  console.log('✅ Regras verificadas e enforçadas');
} catch (error) {
  console.error('❌ VIOLAÇÃO DE REGRA DETECTADA');
  process.exit(1);
}