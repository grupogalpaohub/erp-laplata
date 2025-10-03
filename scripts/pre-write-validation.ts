// scripts/pre-write-validation.ts
// Validação de guardrails ANTES de escrever código
// Executar: npx tsx scripts/pre-write-validation.ts <arquivo>

import { readFileSync } from 'fs';
import { join } from 'path';

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
  },

  // 6. AUTH_SESSION_CLIENT - proibido em Route Handlers
  authSessionClient: {
    pattern: /supabase\.auth\.getSession\(\)/g,
    message: 'supabase.auth.getSession() proibido em Route Handlers - use supabaseServer(cookies())',
    files: ['app/api/**/*.ts']
  },

  // 7. TENANT_ID_SOURCE - deve ser derivado do JWT/session
  tenantIdSource: {
    pattern: /tenant_id.*=.*[^session|JWT|RLS]/g,
    message: 'tenant_id deve ser sempre derivado do JWT/session',
    files: ['app/api/**/*.ts']
  },

  // 8. CORRECTION_REQUIRED - ao remover código incorreto, deve adicionar correção
  correctionRequired: {
    pattern: /\/\/ GUARDRAIL: supabaseServer\(\) já gerencia sessão automaticamente/,
    message: 'OBRIGATÓRIO: Ao remover código incorreto, DEVE adicionar a correção complacente com guardrails',
    files: ['app/api/**/*.ts']
  }
};

function validateCode(content: string, filePath: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Verificar se é arquivo de API
  const isApiFile = filePath.includes('/app/api/');
  const isSdFile = filePath.includes('/app/api/sd/');
  
  // 1. Verificar Supabase SSR
  if (isApiFile && GUARDRAIL_RULES.supabaseSSR.pattern.test(content)) {
    errors.push(`❌ ${GUARDRAIL_RULES.supabaseSSR.message}`);
  }
  
  // 2. Verificar tenant_id no payload
  if (isApiFile && GUARDRAIL_RULES.tenantIdPayload.pattern.test(content)) {
    errors.push(`❌ ${GUARDRAIL_RULES.tenantIdPayload.message}`);
  }
  
  // 3. Verificar nomes proibidos
  for (const rule of GUARDRAIL_RULES.forbiddenNames.patterns) {
    if (rule.pattern.test(content)) {
      // Verificar se não é apenas comentário
      const lines = content.split('\n');
      let isComment = true;
      
      for (const line of lines) {
        if (rule.pattern.test(line) && !line.trim().startsWith('//') && !line.trim().startsWith('*') && !line.trim().startsWith('#')) {
          isComment = false;
          break;
        }
      }
      
      if (!isComment) {
        errors.push(`❌ ${rule.message}`);
      }
    }
  }
  
  // 4. Verificar campos gerados
  if (isApiFile) {
    for (const rule of GUARDRAIL_RULES.generatedFields.patterns) {
      if (rule.pattern.test(content)) {
        errors.push(`❌ ${rule.message}`);
      }
    }
  }
  
  // 5. Verificar status SD
  if (isSdFile && GUARDRAIL_RULES.sdStatus.pattern.test(content)) {
    errors.push(`❌ ${GUARDRAIL_RULES.sdStatus.message}`);
  }
  
  // 6. Verificar AUTH_SESSION_CLIENT
  if (isApiFile && GUARDRAIL_RULES.authSessionClient.pattern.test(content)) {
    errors.push(`❌ ${GUARDRAIL_RULES.authSessionClient.message}`);
  }
  
  // 7. Verificar TENANT_ID_SOURCE
  if (isApiFile && content.includes('tenant_id') && 
      !content.includes('session') && !content.includes('JWT') && 
      !content.includes('RLS filtra automaticamente') && 
      !content.includes('select') && !content.includes('tenant_id')) {
    errors.push(`❌ ${GUARDRAIL_RULES.tenantIdSource.message}`);
  }
  
  // 8. Verificar CORRECTION_REQUIRED
  if (isApiFile && content.includes('// GUARDRAIL: supabaseServer() já gerencia sessão automaticamente') && 
      !content.includes('cookies()')) {
    errors.push(`❌ ${GUARDRAIL_RULES.correctionRequired.message}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

function validateFile(filePath: string): void {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const result = validateCode(content, filePath);
    
    if (!result.valid) {
      console.log(`\n🚨 GUARDRAILS VIOLADOS em ${filePath}:\n`);
      result.errors.forEach(error => console.log(`  ${error}`));
      console.log(`\n🛡️ CORRIJA ANTES DE CONTINUAR!\n`);
      process.exit(1);
    } else {
      console.log(`✅ ${filePath} - Guardrails OK`);
    }
  } catch (error) {
    console.log(`❌ Erro ao ler arquivo ${filePath}:`, error);
    process.exit(1);
  }
}

// Executar validação
const filePath = process.argv[2];
if (!filePath) {
  console.log('❌ Uso: npx tsx scripts/pre-write-validation.ts <arquivo>');
  process.exit(1);
}

validateFile(filePath);
