#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * VALIDADOR DE SEGURANÇA - GARANTE COMPLIANCE COM REGRAS INEGOCIÁVEIS
 * 
 * Valida que não há violações de segurança:
 * - SERVICE_ROLE_KEY no frontend
 * - Hardcode de tenant
 * - Mutação de DB em Client Components
 * - Desabilitação de RLS
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// ============================================================================
// REGRAS DE SEGURANÇA
// ============================================================================

const SECURITY_RULES = [
  {
    name: 'NO_SERVICE_ROLE_FRONTEND',
    pattern: /SUPABASE_SERVICE_ROLE_KEY/g,
    message: 'SERVICE_ROLE_KEY não pode ser usado no frontend',
    severity: 'CRITICAL',
    excludePaths: ['/api/']
  },
  {
    name: 'NO_TENANT_HARDCODE',
    pattern: /['"]LaplataLunaria['"]/g,
    message: 'Hardcode de tenant proibido',
    severity: 'HIGH',
    excludePaths: ['/setup/', '/migrations/', '/seed/', '/debug/']
  },
  {
    name: 'NO_CLIENT_DB_MUTATION',
    pattern: /supabase\.from\([^)]+\)\.(insert|update|delete|upsert)\s*\(/g,
    message: 'Mutação de DB em Client Component proibida',
    severity: 'HIGH',
    onlyInClientComponents: true
  },
  {
    name: 'NO_RLS_DISABLE',
    pattern: /ALTER TABLE.*DISABLE ROW LEVEL SECURITY/g,
    message: 'Desabilitação de RLS proibida',
    severity: 'CRITICAL'
  },
  {
    name: 'NO_TENANT_ID_PAYLOAD',
    pattern: /tenant_id.*:/g,
    message: 'tenant_id não deve ser enviado em payloads',
    severity: 'MEDIUM',
    excludePaths: ['/setup/', '/migrations/', '/seed/']
  }
];

// ============================================================================
// VALIDAÇÃO DE ARQUIVOS
// ============================================================================

function validateSecurityRules() {
  console.log('🔒 VALIDANDO REGRAS DE SEGURANÇA...');
  
  const violations = [];
  const files = glob.sync('app/**/*.{ts,tsx}');
  
  for (const file of files) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const isClientComponent = content.includes("'use client'") || content.includes('"use client"');
      
      for (const rule of SECURITY_RULES) {
        // Verificar se arquivo está excluído
        if (rule.excludePaths && rule.excludePaths.some(exclude => file.includes(exclude))) {
          continue;
        }
        
        // Verificar se regra se aplica apenas a Client Components
        if (rule.onlyInClientComponents && !isClientComponent) {
          continue;
        }
        
        // Verificar padrão
        const matches = content.match(rule.pattern);
        if (matches) {
          matches.forEach(match => {
            violations.push({
              file,
              rule: rule.name,
              type: 'SECURITY_VIOLATION',
              message: rule.message,
              severity: rule.severity,
              line: getLineNumber(content, match),
              match: match.trim()
            });
          });
        }
      }
    }
  }
  
  return violations;
}

function getLineNumber(content, searchString) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchString)) {
      return i + 1;
    }
  }
  return 0;
}

// ============================================================================
// VALIDAÇÃO DE AUTENTICAÇÃO
// ============================================================================

function validateAuthentication() {
  console.log('🔐 VALIDANDO AUTENTICAÇÃO...');
  
  const violations = [];
  const files = glob.sync('app/**/*.{ts,tsx}');
  
  for (const file of files) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Verificar se arquivo usa Supabase mas não tem autenticação (apenas frontend)
      if (content.includes('supabase') && !content.includes('requireSession') && 
          !file.includes('/api/') && !file.includes('createClient')) {
        violations.push({
          file,
          rule: 'MISSING_AUTH',
          type: 'AUTHENTICATION_VIOLATION',
          message: 'Arquivo usa Supabase mas não tem autenticação',
          severity: 'HIGH',
          line: 1
        });
      }
      
      // Verificar se arquivo usa getTenantId() (padrão antigo)
      if (content.includes('getTenantId()')) {
        violations.push({
          file,
          rule: 'OLD_TENANT_PATTERN',
          type: 'AUTHENTICATION_VIOLATION',
          message: 'getTenantId() é padrão antigo, usar requireSession()',
          severity: 'MEDIUM',
          line: getLineNumber(content, 'getTenantId()')
        });
      }
    }
  }
  
  return violations;
}

// ============================================================================
// VALIDAÇÃO DE RLS
// ============================================================================

function validateRLS() {
  console.log('🛡️ VALIDANDO RLS...');
  
  const violations = [];
  const files = glob.sync('app/**/*.{ts,tsx}');
  
  for (const file of files) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Verificar se arquivo filtra por tenant_id manualmente
      if (content.includes('.eq(\'tenant_id\',') && !file.includes('/api/')) {
        violations.push({
          file,
          rule: 'MANUAL_TENANT_FILTER',
          type: 'RLS_VIOLATION',
          message: 'Filtro manual de tenant_id proibido, RLS filtra automaticamente',
          severity: 'MEDIUM',
          line: getLineNumber(content, '.eq(\'tenant_id\',')
        });
      }
      
      // Verificar se arquivo usa createClient com SERVICE_ROLE_KEY
      if (content.includes('createClient') && content.includes('SERVICE_ROLE_KEY') && !file.includes('/api/')) {
        violations.push({
          file,
          rule: 'SERVICE_ROLE_IN_FRONTEND',
          type: 'RLS_VIOLATION',
          message: 'createClient com SERVICE_ROLE_KEY proibido no frontend',
          severity: 'CRITICAL',
          line: getLineNumber(content, 'createClient')
        });
      }
    }
  }
  
  return violations;
}

// ============================================================================
// VALIDAÇÃO DE MUTAÇÕES
// ============================================================================

function validateMutations() {
  console.log('🔄 VALIDANDO MUTAÇÕES...');
  
  const violations = [];
  const files = glob.sync('app/**/*.{ts,tsx}');
  
  for (const file of files) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const isClientComponent = content.includes("'use client'") || content.includes('"use client"');
      
      // Verificar se Client Component faz mutação
      if (isClientComponent && content.includes('supabase.from(')) {
        const mutationPatterns = ['.insert(', '.update(', '.delete(', '.upsert('];
        for (const pattern of mutationPatterns) {
          if (content.includes(pattern)) {
            violations.push({
              file,
              rule: 'CLIENT_MUTATION',
              type: 'MUTATION_VIOLATION',
              message: `Mutação ${pattern} proibida em Client Component`,
              severity: 'HIGH',
              line: getLineNumber(content, pattern)
            });
          }
        }
      }
      
      // Verificar se Server Action tem revalidatePath
      if (content.includes("'use server'") && content.includes('supabase.from(')) {
        const hasMutation = content.includes('.insert(') || content.includes('.update(') || 
                           content.includes('.delete(') || content.includes('.upsert(');
        const hasRevalidate = content.includes('revalidatePath(');
        
        if (hasMutation && !hasRevalidate) {
          violations.push({
            file,
            rule: 'MISSING_REVALIDATE',
            type: 'MUTATION_VIOLATION',
            message: 'Server Action com mutação deve ter revalidatePath()',
            severity: 'MEDIUM',
            line: 1
          });
        }
      }
    }
  }
  
  return violations;
}

// ============================================================================
// FUNÇÃO PRINCIPAL
// ============================================================================

function main() {
  console.log('🚀 INICIANDO VALIDAÇÃO DE SEGURANÇA...\n');
  
  const allViolations = [];
  
  // 1. Validar regras de segurança
  const securityViolations = validateSecurityRules();
  allViolations.push(...securityViolations);
  
  // 2. Validar autenticação
  const authViolations = validateAuthentication();
  allViolations.push(...authViolations);
  
  // 3. Validar RLS
  const rlsViolations = validateRLS();
  allViolations.push(...rlsViolations);
  
  // 4. Validar mutações
  const mutationViolations = validateMutations();
  allViolations.push(...mutationViolations);
  
  // 5. Relatório final
  if (allViolations.length > 0) {
    console.log('\n❌ VIOLAÇÕES DE SEGURANÇA DETECTADAS:');
    
    // Agrupar por severidade
    const critical = allViolations.filter(v => v.severity === 'CRITICAL');
    const high = allViolations.filter(v => v.severity === 'HIGH');
    const medium = allViolations.filter(v => v.severity === 'MEDIUM');
    
    if (critical.length > 0) {
      console.log('\n🚨 CRÍTICAS:');
      critical.forEach(v => {
        console.log(`  ${v.file}:${v.line} - ${v.message}`);
        console.log(`    Match: "${v.match}"`);
      });
    }
    
    if (high.length > 0) {
      console.log('\n⚠️ ALTAS:');
      high.forEach(v => {
        console.log(`  ${v.file}:${v.line} - ${v.message}`);
      });
    }
    
    if (medium.length > 0) {
      console.log('\n📝 MÉDIAS:');
      medium.forEach(v => {
        console.log(`  ${v.file}:${v.line} - ${v.message}`);
      });
    }
    
    console.log('\n🔧 CORREÇÕES NECESSÁRIAS:');
    console.log('  1. Remover SERVICE_ROLE_KEY do frontend');
    console.log('  2. Remover hardcode de tenant');
    console.log('  3. Mover mutações para Server Actions');
    console.log('  4. Usar requireSession() para autenticação');
    console.log('  5. Remover filtros manuais de tenant_id');
    console.log('  6. Adicionar revalidatePath() após mutações');
    
    process.exit(1);
  } else {
    console.log('\n✅ VALIDAÇÃO DE SEGURANÇA APROVADA!');
    console.log('   - Sem SERVICE_ROLE_KEY no frontend');
    console.log('   - Sem hardcode de tenant');
    console.log('   - Mutações apenas em Server Actions');
    console.log('   - Autenticação adequada');
    console.log('   - RLS funcionando corretamente');
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateSecurityRules, validateAuthentication, validateRLS, validateMutations };
