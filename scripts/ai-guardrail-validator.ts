// scripts/ai-guardrail-validator.ts
// Validador automático para IA - executa ANTES de qualquer edição
// Integra com o sistema de guardrails existente

import { readFileSync } from 'fs';

interface GuardrailViolation {
  rule: string;
  message: string;
  severity: 'ERROR' | 'WARNING';
}

class AIGuardrailValidator {
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

  validateCode(content: string, filePath: string): { valid: boolean; violations: GuardrailViolation[] } {
    const violations: GuardrailViolation[] = [];
    
    // Verificar se é arquivo de API
    const isApiFile = filePath.includes('/app/api/');
    const isSdFile = filePath.includes('/app/api/sd/');
    
    // 1. Verificar Supabase SSR
    if (isApiFile && this.GUARDRAIL_RULES.SUPABASE_SSR.pattern.test(content)) {
      violations.push({
        rule: 'SUPABASE_SSR',
        message: this.GUARDRAIL_RULES.SUPABASE_SSR.message,
        severity: 'ERROR'
      });
    }
    
    // 2. Verificar tenant_id no payload
    if (isApiFile && this.GUARDRAIL_RULES.TENANT_ID_PAYLOAD.pattern.test(content)) {
      violations.push({
        rule: 'TENANT_ID_PAYLOAD',
        message: this.GUARDRAIL_RULES.TENANT_ID_PAYLOAD.message,
        severity: 'ERROR'
      });
    }
    
    // 3. Verificar AUTH_SESSION_CLIENT
    if (isApiFile && this.GUARDRAIL_RULES.AUTH_SESSION_CLIENT.pattern.test(content)) {
      violations.push({
        rule: 'AUTH_SESSION_CLIENT',
        message: this.GUARDRAIL_RULES.AUTH_SESSION_CLIENT.message,
        severity: 'ERROR'
      });
    }
    
    // 4. Verificar TENANT_ID_SOURCE
    if (isApiFile && content.includes('tenant_id') && 
        !content.includes('session') && !content.includes('JWT') && 
        !content.includes('RLS filtra automaticamente') && 
        !content.includes('select') && !content.includes('tenant_id')) {
      violations.push({
        rule: 'TENANT_ID_SOURCE',
        message: this.GUARDRAIL_RULES.TENANT_ID_SOURCE.message,
        severity: 'WARNING'
      });
    }
    
    // 5. Verificar CORRECTION_REQUIRED
    if (isApiFile && content.includes('// GUARDRAIL: supabaseServer() já gerencia sessão automaticamente') && 
        !content.includes('cookies()')) {
      violations.push({
        rule: 'CORRECTION_REQUIRED',
        message: this.GUARDRAIL_RULES.CORRECTION_REQUIRED.message,
        severity: 'ERROR'
      });
    }
    
    // 6. Verificar nomes proibidos
    for (const rule of this.GUARDRAIL_RULES.FORBIDDEN_NAMES.patterns) {
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
          violations.push({
            rule: 'FORBIDDEN_NAMES',
            message: rule.message,
            severity: 'ERROR'
          });
        }
      }
    }
    
    // 7. Verificar campos gerados
    if (isApiFile) {
      for (const rule of this.GUARDRAIL_RULES.GENERATED_FIELDS.patterns) {
        if (rule.pattern.test(content)) {
          violations.push({
            rule: 'GENERATED_FIELDS',
            message: rule.message,
            severity: 'ERROR'
          });
        }
      }
    }
    
    // 8. Verificar status SD
    if (isSdFile && this.GUARDRAIL_RULES.SD_STATUS.pattern.test(content)) {
      violations.push({
        rule: 'SD_STATUS',
        message: this.GUARDRAIL_RULES.SD_STATUS.message,
        severity: 'ERROR'
      });
    }
    
    return {
      valid: violations.length === 0,
      violations
    };
  }

  printViolations(filePath: string, violations: GuardrailViolation[]): void {
    if (violations.length === 0) {
      console.log(`✅ ${filePath} - Guardrails OK`);
      return;
    }

    console.log(`\n🚨 GUARDRAILS VIOLADOS em ${filePath}:\n`);
    violations.forEach(violation => {
      const icon = violation.severity === 'ERROR' ? '❌' : '⚠️';
      console.log(`  ${icon} ${violation.message}`);
    });
    console.log(`\n🛡️ CORRIJA ANTES DE CONTINUAR!\n`);
  }
}

// Função principal para validação
export function validateFileForAI(filePath: string): boolean {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const validator = new AIGuardrailValidator();
    const result = validator.validateCode(content, filePath);
    
    validator.printViolations(filePath, result.violations);
    
    if (!result.valid) {
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
  if (!filePath) {
    console.log('❌ Uso: npx tsx scripts/ai-guardrail-validator.ts <arquivo>');
    process.exit(1);
  }
  
  const isValid = validateFileForAI(filePath);
  process.exit(isValid ? 0 : 1);
}