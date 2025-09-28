// scripts/validate-forbidden-fields.ts
// Script para validar que não há campos proibidos no código
// GUARDRAIL COMPLIANCE: Validação automática

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const FORBIDDEN_FIELDS = [
  'po_id',           // Deve ser mm_order
  'transaction_type', // Deve ser type
  'movement_type',   // Deve ser type
  'quantity_available' // Generated column - nunca inserir
];

const FORBIDDEN_PATTERNS = [
  /createClient\(/g,  // Proibido em rotas API
  /tenant_id\s*:\s*body\./g, // tenant_id nunca do payload
];

const ALLOWED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const IGNORE_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', 'supabase/functions'];
const IGNORE_FILES = ['src/types/db.ts', 'scripts/guardrails-check.ts', 'scripts/validate-forbidden-fields.ts'];

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
        // Ignorar arquivos específicos
        if (!IGNORE_FILES.some(ignoreFile => fullPath.includes(ignoreFile))) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Ignorar erros de permissão
  }
  
  return files;
}

function validateFile(filePath: string): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Ignorar o próprio script de validação
  if (filePath.includes('validate-forbidden-fields.ts')) {
    return { errors, warnings };
  }
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // Verificar campos proibidos (ignorar comentários)
    for (const field of FORBIDDEN_FIELDS) {
      const regex = new RegExp(`\\b${field}\\b`, 'g');
      const matches = content.match(regex);
      
      if (matches) {
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          // Ignorar linhas que são apenas comentários
          if (line.includes(field) && !line.startsWith('//') && !line.startsWith('*') && !line.startsWith('#')) {
            errors.push(`${filePath}:${i + 1} - Campo proibido '${field}' encontrado`);
          }
        }
      }
    }
    
    // Verificar padrões proibidos
    for (const pattern of FORBIDDEN_PATTERNS) {
      const matches = content.match(pattern);
      
      if (matches) {
        for (let i = 0; i < lines.length; i++) {
          if (pattern.test(lines[i])) {
            if (pattern.source.includes('createClient')) {
              errors.push(`${filePath}:${i + 1} - createClient() proibido em rotas API - use @supabase/ssr + cookies()`);
            } else if (pattern.source.includes('tenant_id')) {
              errors.push(`${filePath}:${i + 1} - tenant_id não deve vir do payload - derive da sessão`);
            }
          }
        }
      }
    }
    
    // Verificar se é rota API e usa createClient
    if (filePath.includes('/app/api/') && content.includes('createClient(')) {
      errors.push(`${filePath} - Rota API usando createClient() - deve usar @supabase/ssr + cookies()`);
    }
    
  } catch (error) {
    warnings.push(`${filePath} - Erro ao ler arquivo: ${error}`);
  }
  
  return { errors, warnings };
}

function main() {
  console.log('🔍 Validando campos proibidos e padrões...\n');
  
  const projectRoot = process.cwd();
  const files = getAllFiles(projectRoot);
  
  let totalErrors = 0;
  let totalWarnings = 0;
  
  for (const file of files) {
    const { errors, warnings } = validateFile(file);
    
    if (errors.length > 0 || warnings.length > 0) {
      console.log(`📁 ${file}`);
      
      for (const error of errors) {
        console.log(`  ❌ ${error}`);
        totalErrors++;
      }
      
      for (const warning of warnings) {
        console.log(`  ⚠️  ${warning}`);
        totalWarnings++;
      }
      
      console.log('');
    }
  }
  
  console.log('📊 Resumo da Validação:');
  console.log(`  ❌ Erros: ${totalErrors}`);
  console.log(`  ⚠️  Avisos: ${totalWarnings}`);
  console.log(`  📁 Arquivos verificados: ${files.length}`);
  
  if (totalErrors > 0) {
    console.log('\n❌ VALIDAÇÃO FALHOU - Corrija os erros antes de continuar');
    process.exit(1);
  } else {
    console.log('\n✅ VALIDAÇÃO PASSOU - Nenhum campo proibido encontrado');
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

export { validateFile, getAllFiles, FORBIDDEN_FIELDS, FORBIDDEN_PATTERNS };
