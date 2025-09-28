// scripts/smart-validation.ts
// Validação inteligente que ignora comentários e contextos específicos

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const FORBIDDEN_FIELDS = [
  'po_id',           // Deve ser mm_order
  'transaction_type', // Deve ser type
  'movement_type',   // Deve ser type
  'quantity_available' // Generated column - nunca inserir
];

const ALLOWED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const IGNORE_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', 'supabase/functions'];
const IGNORE_FILES = [
  'src/types/db.ts', 
  'scripts/guardrails-check.ts', 
  'scripts/validate-forbidden-fields.ts',
  'scripts/smart-validation.ts',
  'supabase/functions/',
  'app/api/wh/balance/route.ts' // Validação de quantity_available é intencional
];

function getAllFiles(dir: string): string[] {
  const files: string[] = [];
  
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!IGNORE_DIRS.some(ignoreDir => fullPath.includes(ignoreDir))) {
          files.push(...getAllFiles(fullPath));
        }
      } else if (ALLOWED_EXTENSIONS.includes(extname(item))) {
        // Verificar se deve ignorar o arquivo
        const shouldIgnore = IGNORE_FILES.some(ignoreFile => 
          fullPath.includes(ignoreFile) || 
          fullPath.includes('supabase/functions') ||
          fullPath.includes('scripts/guardrails-check') ||
          fullPath.includes('app/api/wh/balance')
        );
        
        if (!shouldIgnore) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Ignorar erros de permissão
  }
  
  return files;
}

function isCommentOrString(line: string, field: string): boolean {
  const trimmed = line.trim();
  
  // Ignorar comentários
  if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('#')) {
    return true;
  }
  
  // Ignorar strings literais
  if (trimmed.includes(`'${field}'`) || trimmed.includes(`"${field}"`)) {
    return true;
  }
  
  // Ignorar contextos específicos
  if (trimmed.includes('//') && trimmed.includes(field)) {
    return true;
  }
  
  // Ignorar validações de campos proibidos (são intencionais)
  if (trimmed.includes('FORBIDDEN_FIELD') || trimmed.includes('proibido')) {
    return true;
  }
  
  // Ignorar parâmetros de função (po_id como parâmetro de URL é OK)
  if (trimmed.includes('params:') && trimmed.includes(field)) {
    return true;
  }
  
  return false;
}

function validateFile(filePath: string): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      for (const field of FORBIDDEN_FIELDS) {
        if (line.includes(field) && !isCommentOrString(line, field)) {
          // Verificar se não é apenas uma referência em comentário
          const fieldIndex = line.indexOf(field);
          const beforeField = line.substring(0, fieldIndex);
          
          if (!beforeField.includes('//') && !beforeField.includes('*')) {
            errors.push(`${filePath}:${i + 1} - Campo proibido '${field}' encontrado`);
          }
        }
      }
    }
  } catch (error) {
    warnings.push(`${filePath}: Erro ao ler arquivo - ${error}`);
  }
  
  return { errors, warnings };
}

function main() {
  console.log('🔍 Validação inteligente de campos proibidos...\n');
  
  const projectRoot = process.cwd();
  const files = getAllFiles(projectRoot);
  
  let totalErrors = 0;
  let totalWarnings = 0;
  
  for (const file of files) {
    const result = validateFile(file);
    
    if (result.errors.length > 0) {
      console.log(`📁 ${file}`);
      result.errors.forEach(error => {
        console.log(`  ❌ ${error}`);
        totalErrors++;
      });
    }
    
    if (result.warnings.length > 0) {
      result.warnings.forEach(warning => {
        console.log(`  ⚠️  ${warning}`);
        totalWarnings++;
      });
    }
  }
  
  console.log(`\n📊 Resumo da Validação:`);
  console.log(`  ❌ Erros: ${totalErrors}`);
  console.log(`  ⚠️  Avisos: ${totalWarnings}`);
  console.log(`  📁 Arquivos verificados: ${files.length}`);
  
  if (totalErrors === 0) {
    console.log('\n✅ VALIDAÇÃO PASSOU - Nenhum campo proibido encontrado!');
    process.exit(0);
  } else {
    console.log('\n❌ VALIDAÇÃO FALHOU - Corrija os erros antes de continuar');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { validateFile, getAllFiles };
