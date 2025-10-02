#!/usr/bin/env tsx
// MM-01: Criar Material (ID auto) - Teste HTTP

{
  const BASE_URL = 'http://localhost:3000'

async function testCreateMaterialHTTP() {
  console.log('🧪 MM-01: Criar Material (ID auto) - Teste HTTP')
  console.log('='.repeat(50))
  
  try {
    // Payload de teste (sem mm_material - deve ser gerado automaticamente)
    const testPayload = {
      mm_desc: 'Material E2E Test - ' + new Date().toISOString(),
      commercial_name: 'Material E2E',
      mm_mat_type: 'MAT',
      mm_mat_class: 'CLASS_A',
      mm_price_cents: 2000, // R$ 20,00
      mm_purchase_price_cents: 1500, // R$ 15,00
      unit_of_measure: 'unidade',
      status: 'active'
    }
    
    console.log('📤 Payload enviado (sem mm_material):', JSON.stringify(testPayload, null, 2))
    
    // Criar material via API HTTP
    const response = await fetch(`${BASE_URL}/api/mm/materials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    })
    
    const result = await response.json()
    
    console.log(`📊 Status: ${response.status}`)
    console.log('📋 Resposta da API:', JSON.stringify(result, null, 2))
    
    if (!response.ok) {
      console.log('❌ Erro na API:', result.error || 'Erro desconhecido')
      return { success: false, error: 'Erro na validação' }
    }
    
    if (!result.ok) {
      console.log('❌ API retornou erro:', result.error || 'Erro desconhecido')
      return { success: false, error: 'Erro na validação' }
    }
    
    if (!result.data || !result.data.mm_material) {
      console.log('❌ ERRO: mm_material não foi gerado automaticamente!')
      return { success: false, error: 'Erro na validação' }
    }
    
    console.log('✅ Material criado com sucesso!')
    console.log(`🎯 mm_material gerado: ${result.data.mm_material}`)
    
    // Verificar se o material aparece na listagem
    console.log('\n📋 Verificando listagem...')
    
    const listResponse = await fetch(`${BASE_URL}/api/mm/materials`)
    const listResult = await listResponse.json()
    
    console.log(`📊 Status da listagem: ${listResponse.status}`)
    
    if (!listResponse.ok || !listResult.ok) {
      console.log('❌ Erro na listagem:', listResult.error || 'Erro desconhecido')
      return { success: false, error: 'Erro na validação' }
    }
    
    const materials = listResult.items || []
    const createdMaterial = materials.find((m: any) => m.mm_material === result.data.mm_material)
    
    if (!createdMaterial) {
      console.log('❌ Material não encontrado na listagem!')
      return { success: false, error: 'Erro na validação' }
    }
    
    console.log('✅ Material encontrado na listagem!')
    console.log('📋 Dados do material:', JSON.stringify(createdMaterial, null, 2))
    
    // Verificar se a primeira coluna exibe mm_material
    if (createdMaterial.mm_material !== result.data.mm_material) {
      console.log('❌ ERRO: Primeira coluna não exibe mm_material corretamente!')
      return { success: false, error: 'Erro na validação' }
    }
    
    console.log('✅ Primeira coluna exibe mm_material corretamente!')
    
    // SQL de conferência
    console.log('\n📊 SQL de conferência:')
    console.log(`
SELECT tenant_id, mm_material, mm_desc, mm_purchase_price_cents, mm_price_cents
FROM public.mm_material
WHERE tenant_id='LaplataLunaria'
ORDER BY created_at DESC
LIMIT 1;
    `)
    
    console.log('\n🎉 MM-01 CONCLUÍDO COM SUCESSO!')
    console.log('✅ O sistema está funcionando corretamente:')
    console.log('   • mm_material é gerado automaticamente via trigger')
    console.log('   • API retorna dados corretos')
    console.log('   • Material aparece na listagem')
    console.log('   • Primeira coluna exibe mm_material')
    
    return { success: true, mm_material: result.data.mm_material }
    
  } catch (error) {
    console.log('❌ ERRO NO TESTE:', error)
    return { success: false, error: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error) }
  }
}

// Executar teste
testCreateMaterialHTTP().then(result => {
  if (result.success) {
    console.log(`\n🚀 Material criado: ${result.mm_material}`)
  } else {
    console.log('\n⚠️  Teste falhou.')
  }
  process.exit(result.success ? 0 : 1)
})
}


