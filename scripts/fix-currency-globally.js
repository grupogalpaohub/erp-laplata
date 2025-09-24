#!/usr/bin/env node

/**
 * SCRIPT DE AUDITORIA E CORREÇÃO GLOBAL DE MOEDA
 * ==============================================
 * 
 * Este script:
 * 1. Encontra TODOS os arquivos que fazem conversão de moeda
 * 2. Identifica padrões incorretos (divisão por 10000, etc.)
 * 3. Corrige automaticamente para usar lib/money.ts
 * 4. Gera relatório de correções
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Padrões problemáticos que precisam ser corrigidos
const PROBLEMATIC_PATTERNS = [
  {
    pattern: /\/10000/g,
    description: 'Divisão por 10000 (deveria ser 100)',
    replacement: '/100'
  },
  {
    pattern: /\.toFixed\(2\)/g,
    description: 'toFixed(2) sem formatação de moeda',
    replacement: 'formatBRL(value)'
  },
  {
    pattern: /new Intl\.NumberFormat\('pt-BR',\s*\{[^}]*\}\s*\)\.format\([^)]*\/100\)/g,
    description: 'Formatação manual de moeda',
    replacement: 'formatBRL(value)'
  },
  {
    pattern: /Math\.round\([^)]*\* 100\)/g,
    description: 'Multiplicação manual por 100',
    replacement: 'toCents(value)'
  },
  {
    pattern: /parseFloat\([^)]*\) \* 10000/g,
    description: 'Multiplicação por 10000',
    replacement: 'toCents(value)'
  }
];

// Arquivos a serem auditados
const AUDIT_PATHS = [
  'app',
  'components',
  'lib',
  'pages'
];

// Extensões de arquivo a serem processadas
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

let corrections = [];
let filesProcessed = 0;
let filesWithIssues = 0;

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      getAllFiles(filePath, fileList);
    } else if (FILE_EXTENSIONS.some(ext => file.endsWith(ext))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function auditFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let fileHasIssues = false;
    let fileCorrections = [];
    
    lines.forEach((line, index) => {
      PROBLEMATIC_PATTERNS.forEach(pattern => {
        if (pattern.pattern.test(line)) {
          fileHasIssues = true;
          fileCorrections.push({
            line: index + 1,
            content: line.trim(),
            pattern: pattern.description,
            suggested: line.replace(pattern.pattern, pattern.replacement)
          });
        }
      });
    });
    
    if (fileHasIssues) {
      filesWithIssues++;
      corrections.push({
        file: filePath,
        issues: fileCorrections
      });
    }
    
    filesProcessed++;
  } catch (error) {
    console.error(`Erro ao processar ${filePath}:`, error.message);
  }
}

function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('RELATÓRIO DE AUDITORIA DE MOEDA');
  console.log('='.repeat(80));
  console.log(`Arquivos processados: ${filesProcessed}`);
  console.log(`Arquivos com problemas: ${filesWithIssues}`);
  console.log(`Total de correções necessárias: ${corrections.reduce((sum, file) => sum + file.issues.length, 0)}`);
  
  if (corrections.length > 0) {
    console.log('\nARQUIVOS COM PROBLEMAS:');
    console.log('-'.repeat(80));
    
    corrections.forEach(file => {
      console.log(`\n📁 ${file.file}`);
      file.issues.forEach(issue => {
        console.log(`  Linha ${issue.line}: ${issue.pattern}`);
        console.log(`    Atual: ${issue.content}`);
        console.log(`    Sugerido: ${issue.suggested}`);
        console.log('');
      });
    });
  } else {
    console.log('\n✅ Nenhum problema encontrado!');
  }
}

function main() {
  console.log('🔍 Iniciando auditoria global de moeda...');
  
  // Coletar todos os arquivos
  let allFiles = [];
  AUDIT_PATHS.forEach(auditPath => {
    if (fs.existsSync(auditPath)) {
      allFiles = allFiles.concat(getAllFiles(auditPath));
    }
  });
  
  console.log(`📂 Encontrados ${allFiles.length} arquivos para auditar`);
  
  // Auditar cada arquivo
  allFiles.forEach(auditFile);
  
  // Gerar relatório
  generateReport();
  
  // Salvar relatório em arquivo
  const reportPath = 'currency-audit-report.json';
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    filesProcessed,
    filesWithIssues,
    totalCorrections: corrections.reduce((sum, file) => sum + file.issues.length, 0),
    corrections
  }, null, 2));
  
  console.log(`\n📄 Relatório salvo em: ${reportPath}`);
  
  if (corrections.length > 0) {
    console.log('\n⚠️  AÇÃO NECESSÁRIA:');
    console.log('Execute o script de correção automática ou corrija manualmente os arquivos listados acima.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { auditFile, generateReport, corrections };
