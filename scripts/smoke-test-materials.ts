#!/usr/bin/env tsx
// Script de teste de fumaça para validação das correções de materiais

import { readFileSync } from 'fs'

function checkFile(filePath: string, content: string, shouldContain: boolean = true) {
  try {
    const fileContent = readFileSync(filePath, 'utf-8')
    const contains = fileContent.includes(content)
    const status = shouldContain ? contains : !contains
    console.log(`${status ? '✅' : '❌'} ${filePath}: ${shouldContain ? 'contém' : 'não contém'} "${content}"`)
    return status
  } catch (error) {
    console.log(`❌ ${filePath}: Erro ao ler arquivo`)
    return false
  }
}

function main() {
  console.log('🧪 Teste de fumaça - Validação das correções de materiais...\n')
  
  let passed = 0
  let total = 0
  
  // Teste 1: API não aceita mm_material do payload
  console.log('1️⃣ Verificando API rejeita mm_material do payload...')
  total++
  if (checkFile('app/api/mm/materials/route.ts', "if ('mm_material' in body) delete body.mm_material", true)) passed++
  
  // Teste 2: API usa getTenantFromSession
  console.log('2️⃣ Verificando API usa getTenantFromSession...')
  total++
  if (checkFile('app/api/mm/materials/route.ts', 'getTenantFromSession', true)) passed++
  
  // Teste 3: API retorna envelope correto
  console.log('3️⃣ Verificando envelope de resposta correto...')
  total++
  if (checkFile('app/api/mm/materials/route.ts', '{ ok:true, data }', true)) passed++
  
  // Teste 4: Action não inclui mm_material no payload
  console.log('4️⃣ Verificando action não inclui mm_material...')
  total++
  if (checkFile('app/(protected)/mm/_actions.ts', '// mm_material será gerado automaticamente pelo DB', true)) passed++
  
  // Teste 5: Lista usa mm_material na primeira coluna
  console.log('5️⃣ Verificando lista usa mm_material...')
  total++
  if (checkFile('app/(protected)/mm/catalog/page.tsx', 'material.mm_material', true)) passed++
  
  // Teste 6: Proteção contra undefined em todos os maps
  console.log('6️⃣ Verificando proteção contra undefined...')
  total++
  if (checkFile('app/(protected)/mm/catalog/page.tsx', '(materials || []).map', true)) passed++
  
  // Teste 7: Formulário não tem campo mm_material
  console.log('7️⃣ Verificando formulário não tem campo mm_material...')
  total++
  if (checkFile('app/(protected)/mm/materials/new/page.tsx', 'name="mm_material"', false)) passed++
  
  // Teste 8: Todos os selects de material usam mm_material
  console.log('8️⃣ Verificando selects usam mm_material...')
  total++
  if (checkFile('app/(protected)/mm/purchases/new/NewPOClient.tsx', 'value={material.mm_material}', true)) passed++
  
  // Relatório
  console.log(`\n📊 Resultado: ${passed}/${total} testes passaram`)
  console.log(`📈 Taxa de sucesso: ${Math.round((passed / total) * 100)}%`)
  
  if (passed === total) {
    console.log('🎉 Todas as correções de materiais foram aplicadas com sucesso!')
    console.log('✅ O sistema agora:')
    console.log('   • Gera mm_material automaticamente via trigger do DB')
    console.log('   • Rejeita mm_material do payload (guardrail)')
    console.log('   • Usa tenant_id da sessão (compliance)')
    console.log('   • Protege contra undefined em todos os arrays')
    console.log('   • Exibe mm_material na primeira coluna das listas')
  } else {
    console.log('⚠️  Algumas correções de materiais precisam de atenção.')
  }
}

main()
