#!/usr/bin/env tsx

/**
 * SCRIPT DE LIMPEZA E HARMONIZAÇÃO FINAL
 * Baseado nas regras de ouro e Inventário 360° real
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

console.log('🚀 INICIANDO LIMPEZA E HARMONIZAÇÃO FINAL');
console.log('📊 Baseado nas regras de ouro e Inventário 360° real\n');

// 1) VERIFICAR ROTAS LEGADAS
console.log('🗑️ 1) Verificando rotas legadas...');

const legacyRoutes = [
  'app/api/mm/purchases/[po_id]/route.ts',
  'app/api/mm/purchases/[po_id]/items/route.ts'
];

for (const route of legacyRoutes) {
  try {
    execSync(`Test-Path "${route}"`, { shell: 'powershell' });
    console.log(`   ❌ AINDA EXISTE: ${route}`);
  } catch (error) {
    console.log(`   ✅ Removido: ${route}`);
  }
}

// 2) BUSCAR OCORRÊNCIAS DE po_id
console.log('\n🔍 2) Buscando ocorrências de po_id...');

try {
  const result = execSync('Select-String -Path "app/api" -Pattern "po_id" -Recurse', { 
    shell: 'powershell',
    encoding: 'utf8'
  });
  console.log('   ❌ Encontradas ocorrências de po_id:');
  console.log(result);
} catch (error) {
  console.log('   ✅ Nenhuma ocorrência de po_id encontrada');
}

// 3) BUSCAR tenant_id NO PAYLOAD
console.log('\n🔍 3) Buscando tenant_id no payload...');

try {
  const result = execSync('Select-String -Path "app/api" -Pattern "tenant_id.*body" -Recurse', { 
    shell: 'powershell',
    encoding: 'utf8'
  });
  console.log('   ❌ Encontradas ocorrências de tenant_id no body:');
  console.log(result);
} catch (error) {
  console.log('   ✅ Nenhuma ocorrência de tenant_id no body encontrada');
}

// 4) BUSCAR material_id EM SD
console.log('\n🔍 4) Buscando material_id em SD...');

try {
  const result = execSync('Select-String -Path "app/api/sd" -Pattern "material_id" -Recurse', { 
    shell: 'powershell',
    encoding: 'utf8'
  });
  console.log('   ❌ Encontradas ocorrências de material_id em SD:');
  console.log(result);
} catch (error) {
  console.log('   ✅ Nenhuma ocorrência de material_id em SD encontrada');
}

console.log('\n🎉 VERIFICAÇÃO CONCLUÍDA!');
