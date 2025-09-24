#!/usr/bin/env node

/**
 * SCRIPT DE VALIDAÇÃO FINAL DE MOEDA
 * ==================================
 * 
 * Este script valida se todas as correções foram aplicadas corretamente
 */

const fs = require('fs');
const path = require('path');

// Padrões que NÃO devem existir mais (problemas corrigidos)
const FORBIDDEN_PATTERNS = [
  /\/10000/g,
  /\* 10000/g,
  /\.toFixed\(2\)/g,
  /new Intl\.NumberFormat\('pt-BR'/g
];

// Padrões que DEVEM existir (soluções aplicadas)
const REQUIRED_PATTERNS = [
  /formatBRL\(/g,
  /toCents\(/g,
  /import.*formatBRL.*from.*@\/lib\/money/g
];

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function validateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Verificar padrões proibidos
    FORBIDDEN_PATTERNS.forEach((pattern, index) => {
      if (pattern.test(content)) {
        issues.push({
          type: 'forbidden',
          pattern: pattern.toString(),
          description: 'Padrão problemático ainda presente'
        });
      }
    });
    
    // Verificar se usa as funções corretas
    const hasFormatBRL = REQUIRED_PATTERNS[0].test(content);
    const hasToCents = REQUIRED_PATTERNS[1].test(content);
    const hasImport = REQUIRED_PATTERNS[2].test(content);
    
    if ((hasFormatBRL || hasToCents) && !hasImport) {
      issues.push({
        type: 'missing_import',
        description: 'Usa formatBRL/toCents mas não importa de @/lib/money'
      });
    }
    
    return issues;
  } catch (error) {
    return [{
      type: 'error',
      description: `Erro ao ler arquivo: ${error.message}`
    }];
  }
}

function main() {
  console.log('🔍 Validando correções de moeda...');
  
  const allFiles = getAllFiles('app').concat(getAllFiles('lib'));
  let totalIssues = 0;
  let filesWithIssues = 0;
  
  allFiles.forEach(filePath => {
    const issues = validateFile(filePath);
    if (issues.length > 0) {
      filesWithIssues++;
      totalIssues += issues.length;
      console.log(`\n❌ ${filePath}:`);
      issues.forEach(issue => {
        console.log(`  - ${issue.description}`);
      });
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('RESULTADO DA VALIDAÇÃO');
  console.log('='.repeat(60));
  console.log(`Arquivos verificados: ${allFiles.length}`);
  console.log(`Arquivos com problemas: ${filesWithIssues}`);
  console.log(`Total de problemas: ${totalIssues}`);
  
  if (totalIssues === 0) {
    console.log('\n✅ TODAS AS CORREÇÕES FORAM APLICADAS COM SUCESSO!');
    console.log('🎉 A lógica de moeda está padronizada em toda a aplicação.');
  } else {
    console.log('\n⚠️  Ainda existem problemas que precisam ser corrigidos.');
    console.log('💡 Verifique os arquivos listados acima.');
  }
}

if (require.main === module) {
  main();
}
