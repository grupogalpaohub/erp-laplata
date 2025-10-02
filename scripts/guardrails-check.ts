// scripts/guardrails-check.ts
// Script de validação automática de guardrails
// Executar: npx tsx scripts/guardrails-check.ts

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const GUARDRAIL_RULES = {
  // 1. Supabase SSR - proibido createClient() em rotas API
  supabaseSSR: {
    pattern: /createClient\(/g,
    message: 'createClient() proibido em rotas API - use supabaseServer()',
    files: ['app/api/**/*.ts']
  },
  
  // 2. tenant_id no payload - proibido
  tenantIdPayload: {
    pattern: /tenant_id.*body\./g,
    message: 'tenant_id não pode vir do payload - derive da sessão',
    files: ['app/api/**/*.ts']
  },
  
  // 3. Nomes proibidos
  forbiddenNames: {
    patterns: [
      { pattern: /\bpo_id\b/g, message: 'po_id proibido - use mm_order' },
      { pattern: /\bmaterial_id\b/g, message: 'material_id proibido em SD - use mm_material' },
      { pattern: /\btransaction_type\b/g, message: 'transaction_type proibido - use type' },
      { pattern: /\bmovement_type\b/g, message: 'movement_type proibido - use type' }
    ],
    files: ['app/**/*.ts', 'src/**/*.ts']
  },
  
  // 4. Campos gerados - proibido escrever
  generatedFields: {
    patterns: [
      { pattern: /quantity_available.*=/g, message: 'quantity_available é gerada - não escreva' },
      { pattern: /total_final_cents.*=/g, message: 'total_final_cents é gerada - não escreva' }
    ],
    files: ['app/api/**/*.ts']
  },
  
  // 5. Status SD - apenas valores válidos
  sdStatus: {
    pattern: /status.*['"](?!draft|approved|invoiced|cancelled)['"]/g,
    message: 'Status SD inválido - use draft|approved|invoiced|cancelled',
    files: ['app/api/sd/**/*.ts']
  }
};

const ALLOWED_EXTENSIONS = ['.ts', '.tsx'];
const IGNORE_DIRS = ['node_modules', '.git', '.next', 'dist', 'build'];

function getAllFiles(dir: string): string[] {
  const files: string[] = [];
  
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!IGNORE_DIRS.includes(item)) {
          files.push(...getAllFiles(fullPath));
        }
      } else if (ALLOWED_EXTENSIONS.includes(extname(item))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignorar erros de permissão
  }
  
  return files;
}

function matchesPattern(filePath: string, pattern: RegExp): boolean {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return pattern.test(content);
  } catch (error) {
    return false;
  }
}

function checkGuardrails(): { passed: boolean; errors: string[] } {
  const errors: string[] = [];
  const projectRoot = process.cwd();
  const files = getAllFiles(projectRoot);
  
  // 1. Verificar Supabase SSR
  const apiFiles = files.filter(f => f.includes('/app/api/'));
  for (const file of apiFiles) {
    if (matchesPattern(file, GUARDRAIL_RULES.supabaseSSR.pattern)) {
      errors.push(`${file}: ${GUARDRAIL_RULES.supabaseSSR.message}`);
    }
  }
  
  // 2. Verificar tenant_id no payload
  for (const file of apiFiles) {
    if (matchesPattern(file, GUARDRAIL_RULES.tenantIdPayload.pattern)) {
      errors.push(`${file}: ${GUARDRAIL_RULES.tenantIdPayload.message}`);
    }
  }
  
  // 3. Verificar nomes proibidos (ignorar comentários e scripts)
  for (const file of files) {
    // Ignorar scripts de validação e arquivos de documentação
    if (file.includes('scripts/') || file.includes('validate-forbidden-fields.ts') || file.includes('guardrails-check.ts')) {
      continue;
    }
    
    for (const rule of GUARDRAIL_RULES.forbiddenNames.patterns) {
      if (matchesPattern(file, rule.pattern)) {
        // Verificar se não é apenas comentário
        try {
          const content = readFileSync(file, 'utf-8');
          const lines = content.split('\n');
          let isComment = true;
          
          for (const line of lines) {
            if (rule.pattern.test(line) && !line.trim().startsWith('//') && !line.trim().startsWith('*') && !line.trim().startsWith('#')) {
              isComment = false;
              break;
            }
          }
          
          if (!isComment) {
            errors.push(`${file}: ${rule.message}`);
          }
        } catch (error) {
          // Se não conseguir ler, adiciona o erro
          errors.push(`${file}: ${rule.message}`);
        }
      }
    }
  }
  
  // 4. Verificar campos gerados
  for (const file of apiFiles) {
    for (const rule of GUARDRAIL_RULES.generatedFields.patterns) {
      if (matchesPattern(file, rule.pattern)) {
        errors.push(`${file}: ${rule.message}`);
      }
    }
  }
  
  // 5. Verificar status SD
  const sdFiles = files.filter(f => f.includes('/app/api/sd/'));
  for (const file of sdFiles) {
    if (matchesPattern(file, GUARDRAIL_RULES.sdStatus.pattern)) {
      errors.push(`${file}: ${GUARDRAIL_RULES.sdStatus.message}`);
    }
  }
  
  return {
    passed: errors.length === 0,
    errors
  };
}

function main() {
  console.log('🔍 Verificando guardrails...\n');
  
  const result = checkGuardrails();
  
  if (result.passed) {
    console.log('✅ Todos os guardrails passaram!');
    process.exit(0);
  } else {
    console.log('❌ Guardrails violados:');
    result.errors.forEach(error => console.log(`  ${error}`));
    console.log(`\nTotal: ${result.errors.length} violações`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { checkGuardrails, GUARDRAIL_RULES };
