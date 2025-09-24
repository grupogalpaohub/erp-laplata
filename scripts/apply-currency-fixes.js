#!/usr/bin/env node

/**
 * SCRIPT DE CORREÇÃO AUTOMÁTICA DE MOEDA
 * ======================================
 * 
 * Este script aplica as correções identificadas na auditoria
 */

const fs = require('fs');
const path = require('path');

// Ler relatório de auditoria
const reportPath = 'currency-audit-report.json';
if (!fs.existsSync(reportPath)) {
  console.error('❌ Relatório de auditoria não encontrado. Execute primeiro o script de auditoria.');
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

console.log('🔧 Aplicando correções automáticas de moeda...');

let filesFixed = 0;
let totalFixes = 0;

// Função para corrigir um arquivo
function fixFile(filePath, issues) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    issues.forEach(issue => {
      const originalContent = content;
      
      // Aplicar correções específicas
      if (issue.pattern.includes('toFixed(2) sem formatação de moeda')) {
        // Substituir (value / 100).toFixed(2) por formatBRL(value)
        content = content.replace(
          /\(([^)]+)\s*\/\s*100\)\.toFixed\(2\)/g,
          'formatBRL($1)'
        );
        
        // Adicionar import se necessário
        if (content.includes('formatBRL(') && !content.includes("import { formatBRL }")) {
          const importMatch = content.match(/import.*from.*['"]/);
          if (importMatch) {
            const lastImport = content.lastIndexOf(importMatch[0]);
            const nextLine = content.indexOf('\n', lastImport);
            content = content.slice(0, nextLine) + 
              '\nimport { formatBRL } from \'@/lib/money\'' + 
              content.slice(nextLine);
          }
        }
      }
      
      if (content !== originalContent) {
        hasChanges = true;
        totalFixes++;
      }
    });
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesFixed++;
      console.log(`✅ Corrigido: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`❌ Erro ao corrigir ${filePath}:`, error.message);
  }
}

// Aplicar correções
report.corrections.forEach(file => {
  fixFile(file.file, file.issues);
});

console.log('\n' + '='.repeat(60));
console.log('RESUMO DAS CORREÇÕES');
console.log('='.repeat(60));
console.log(`Arquivos corrigidos: ${filesFixed}`);
console.log(`Total de correções aplicadas: ${totalFixes}`);

if (filesFixed > 0) {
  console.log('\n✅ Correções aplicadas com sucesso!');
  console.log('💡 Recomendação: Execute os testes para verificar se tudo está funcionando.');
} else {
  console.log('\n⚠️  Nenhuma correção foi aplicada.');
  console.log('💡 Verifique se os padrões de correção estão corretos.');
}
