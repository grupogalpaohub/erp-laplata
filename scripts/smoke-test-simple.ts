#!/usr/bin/env tsx
// Script de teste de fumaça simples

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
  console.log('🧪 Teste de fumaça - Verificando correções...\n')
  
  let passed = 0
  let total = 0
  
  // Teste 1: getSupabaseServerClient removido
  console.log('1️⃣ Verificando getSupabaseServerClient removido...')
  total++
  if (checkFile('app/(protected)/mm/purchases/page.tsx', 'getSupabaseServerClient', false)) passed++
  
  // Teste 2: supabaseServer() sendo usado
  console.log('2️⃣ Verificando supabaseServer() sendo usado...')
  total++
  if (checkFile('app/(protected)/mm/purchases/page.tsx', 'supabaseServer()', true)) passed++
  
  // Teste 3: mm_order nos params
  console.log('3️⃣ Verificando mm_order nos params...')
  total++
  if (checkFile('app/(protected)/mm/purchases/[po_id]/page.tsx', 'params: { mm_order: string }', true)) passed++
  
  // Teste 4: Filtro tenant em materiais
  console.log('4️⃣ Verificando filtro tenant em materiais...')
  total++
  if (checkFile('app/(protected)/mm/_actions.ts', '.eq("tenant_id", tenant_id)', true)) passed++
  
  // Teste 5: Proteção contra undefined
  console.log('5️⃣ Verificando proteção contra undefined...')
  total++
  if (checkFile('app/(protected)/mm/purchases/[po_id]/edit/page.tsx', '(materials || []).map', true)) passed++
  
  // Teste 6: JOIN com mm_material
  console.log('6️⃣ Verificando JOIN com mm_material...')
  total++
  if (checkFile('app/(protected)/mm/purchases/[po_id]/page.tsx', 'material:mm_material!inner', true)) passed++
  
  // Teste 7: Guardrails em APIs
  console.log('7️⃣ Verificando guardrails em APIs...')
  total++
  if (checkFile('app/api/sd/sales-orders/route.ts', "if ('tenant_id' in body)", true)) passed++
  
  // Teste 8: Envelope de resposta
  console.log('8️⃣ Verificando envelope de resposta...')
  total++
  if (checkFile('app/api/sd/sales-orders/route.ts', '{ ok: true, data', true)) passed++
  
  // Relatório
  console.log(`\n📊 Resultado: ${passed}/${total} testes passaram`)
  console.log(`📈 Taxa de sucesso: ${Math.round((passed / total) * 100)}%`)
  
  if (passed === total) {
    console.log('🎉 Todas as correções foram aplicadas com sucesso!')
  } else {
    console.log('⚠️  Algumas correções precisam de atenção.')
  }
}

main()
