// scripts/ai-pre-edit-check.ts
// Sistema de validação automática ANTES de qualquer edição pela IA
// Integra com o sistema de guardrails existente

import { readFileSync } from 'fs';
import { join } from 'path';

interface PreEditValidation {
  filePath: string;
  content: string;
  isValid: boolean;
  violations: string[];
}

class AIPreEditValidator {
  private readonly GUARDRAIL_RULES = {
    // 1. Supabase SSR - proibido createClient() em rotas API
    SUPABASE_SSR: {
      pattern: /createClient\(/g,
      message: 'createClient() proibido em rotas API - use supabaseServer()',
      files: ['app/api/**/*.ts']
    },
    
    // 2. tenant_id no payload - proibido
    TENANT_ID_PAYLOAD: {
      pattern: /tenant_id.*body\./g,
      message: 'tenant_id não pode vir do payload - derive da sessão',
      files: ['app/api/**/*.ts']
    },
    
    // 3. AUTH_SESSION_CLIENT - proibido em Route Handlers
    AUTH_SESSION_CLIENT: {
      pattern: /supabase\.auth\.getSession\(\)/g,
      message: 'supabase.auth.getSession() proibido em Route Handlers - use supabaseServer(cookies())',
      files: ['app/api/**/*.ts']
    },

    // 4. TENANT_ID_SOURCE - deve ser derivado do JWT/session
    TENANT_ID_SOURCE: {
      pattern: /tenant_id.*=.*[^session|JWT|RLS]/g,
      message: 'tenant_id deve ser sempre derivado do JWT/session',
      files: ['app/api/**/*.ts']
    },

    // 5. CORRECTION_REQUIRED - ao remover código incorreto, deve adicionar correção
    CORRECTION_REQUIRED: {
      pattern: /\/\/ GUARDRAIL: supabaseServer\(\) já gerencia sessão automaticamente/,
      message: 'OBRIGATÓRIO: Ao remover código incorreto, DEVE adicionar a correção complacente com guardrails',
      files: ['app/api/**/*.ts']
    },

    // 6. Nomes proibidos
    FORBIDDEN_NAMES: {
      patterns: [
        { pattern: /\bpo_id\b/g, message: 'po_id proibido - use mm_order' },
        { pattern: /\bmaterial_id\b/g, message: 'material_id proibido em SD - use mm_material' },
        { pattern: /\btransaction_type\b/g, message: 'transaction_type proibido - use type' },
        { pattern: /\bmovement_type\b/g, message: 'movement_type proibido - use type' }
      ],
      files: ['app/**/*.ts', 'src/**/*.ts']
    },
    
    // 7. Campos gerados - proibido escrever
    GENERATED_FIELDS: {
      patterns: [
        { pattern: /quantity_available.*=/g, message: 'quantity_available é gerada - não escreva' },
        { pattern: /total_final_cents.*=/g, message: 'total_final_cents é gerada - não escreva' }
      ],
      files: ['app/api/**/*.ts']
    },
    
    // 8. Status SD - apenas valores válidos
    SD_STATUS: {
      pattern: /status.*['"](?!draft|approved|invoiced|cancelled)['"]/g,
      message: 'Status SD inválido - use draft|approved|invoiced|cancelled',
      files: ['app/api/sd/**/*.ts']
    }
  };

  validateBeforeEdit(filePath: string, newContent: string): PreEditValidation {
    const violations: string[] = [];
    
    // Verificar se é arquivo de API
    const isApiFile = filePath.includes('/app/api/');
    const isSdFile = filePath.includes('/app/api/sd/');
    
    // 1. Verificar Supabase SSR
    if (isApiFile && this.GUARDRAIL_RULES.SUPABASE_SSR.pattern.test(newContent)) {
      violations.push(`❌ ${this.GUARDRAIL_RULES.SUPABASE_SSR.message}`);
    }
    
    // 2. Verificar tenant_id no payload
    if (isApiFile && this.GUARDRAIL_RULES.TENANT_ID_PAYLOAD.pattern.test(newContent)) {
      violations.push(`❌ ${this.GUARDRAIL_RULES.TENANT_ID_PAYLOAD.message}`);
    }
    
    // 3. Verificar AUTH_SESSION_CLIENT
    if (isApiFile && this.GUARDRAIL_RULES.AUTH_SESSION_CLIENT.pattern.test(newContent)) {
      violations.push(`❌ ${this.GUARDRAIL_RULES.AUTH_SESSION_CLIENT.message}`);
    }
    
    // 4. Verificar TENANT_ID_SOURCE
    if (isApiFile && newContent.includes('tenant_id') && 
        !newContent.includes('session') && !newContent.includes('JWT') && 
        !newContent.includes('RLS filtra automaticamente') && 
        !newContent.includes('select') && !newContent.includes('tenant_id')) {
      violations.push(`⚠️ ${this.GUARDRAIL_RULES.TENANT_ID_SOURCE.message}`);
    }
    
    // 5. Verificar CORRECTION_REQUIRED
    if (isApiFile && newContent.includes('// GUARDRAIL: supabaseServer() já gerencia sessão automaticamente') && 
        !newContent.includes('cookies()')) {
      violations.push(`❌ ${this.GUARDRAIL_RULES.CORRECTION_REQUIRED.message}`);
    }
    
    // 6. Verificar nomes proibidos
    for (const rule of this.GUARDRAIL_RULES.FORBIDDEN_NAMES.patterns) {
      if (rule.pattern.test(newContent)) {
        // Verificar se não é apenas comentário
        const lines = newContent.split('\n');
        let isComment = true;
        
        for (const line of lines) {
          if (rule.pattern.test(line) && !line.trim().startsWith('//') && !line.trim().startsWith('*') && !line.trim().startsWith('#')) {
            isComment = false;
            break;
          }
        }
        
        if (!isComment) {
          violations.push(`❌ ${rule.message}`);
        }
      }
    }
    
    // 7. Verificar campos gerados
    if (isApiFile) {
      for (const rule of this.GUARDRAIL_RULES.GENERATED_FIELDS.patterns) {
        if (rule.pattern.test(newContent)) {
          violations.push(`❌ ${rule.message}`);
        }
      }
    }
    
    // 8. Verificar status SD
    if (isSdFile && this.GUARDRAIL_RULES.SD_STATUS.pattern.test(newContent)) {
      violations.push(`❌ ${this.GUARDRAIL_RULES.SD_STATUS.message}`);
    }
    
    return {
      filePath,
      content: newContent,
      isValid: violations.length === 0,
      violations
    };
  }

  printValidationResult(result: PreEditValidation): void {
    if (result.isValid) {
      console.log(`✅ ${result.filePath} - Guardrails OK`);
      return;
    }

    console.log(`\n🚨 GUARDRAILS VIOLADOS em ${result.filePath}:\n`);
    result.violations.forEach(violation => {
      console.log(`  ${violation}`);
    });
    console.log(`\n🛡️ CORRIJA ANTES DE CONTINUAR!\n`);
  }
}

// Função principal para validação pré-edição
export function validateBeforeEdit(filePath: string, newContent: string): boolean {
  try {
    const validator = new AIPreEditValidator();
    const result = validator.validateBeforeEdit(filePath, newContent);
    
    validator.printValidationResult(result);
    
    if (!result.isValid) {
      console.log('🛑 BLOQUEADO: Código viola guardrails!');
      return false;
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Erro ao validar arquivo ${filePath}:`, error);
    return false;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const filePath = process.argv[2];
  const newContent = process.argv[3];
  
  if (!filePath || !newContent) {
    console.log('❌ Uso: npx tsx scripts/ai-pre-edit-check.ts <arquivo> <conteudo>');
    process.exit(1);
  }
  
  const isValid = validateBeforeEdit(filePath, newContent);
  process.exit(isValid ? 0 : 1);
}
