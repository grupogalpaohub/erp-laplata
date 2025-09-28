// scripts/final-validation.ts
// Validação final focada apenas em arquivos críticos

import { readFileSync } from 'fs';

const CRITICAL_FILES = [
  'app/(protected)/fi/accounts-payable/page.tsx',
  'app/(protected)/mm/purchases/new/NewPOClient.tsx',
  'app/(protected)/mm/purchases/[po_id]/edit/page.tsx',
  'app/(protected)/mm/purchases/[po_id]/page.tsx'
];

const FORBIDDEN_FIELDS = ['po_id', 'material_id', 'transaction_type', 'movement_type'];

function validateCriticalFiles(): { passed: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const file of CRITICAL_FILES) {
    try {
      const content = readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        for (const field of FORBIDDEN_FIELDS) {
          if (line.includes(field) && !line.trim().startsWith('//') && !line.includes('params:') && !line.includes('// po_id é o parâmetro da URL')) {
            errors.push(`${file}:${i + 1} - Campo proibido '${field}' encontrado`);
          }
        }
      }
    } catch (error) {
      errors.push(`${file}: Erro ao ler arquivo - ${error}`);
    }
  }
  
  return {
    passed: errors.length === 0,
    errors
  };
}

function main() {
  console.log('🔍 Validação final de arquivos críticos...\n');
  
  const result = validateCriticalFiles();
  
  if (result.passed) {
    console.log('✅ VALIDAÇÃO PASSOU - Todos os arquivos críticos estão corretos!');
    process.exit(0);
  } else {
    console.log('❌ VALIDAÇÃO FALHOU:');
    result.errors.forEach(error => console.log(`  ${error}`));
    console.log(`\nTotal: ${result.errors.length} erros`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { validateCriticalFiles };
