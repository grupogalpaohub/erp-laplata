#!/usr/bin/env tsx
// MM-02: Criar Vendor e vincular no Material

{
  const BASE_URL = 'http://localhost:3000'

async function testCreateVendor() {
  console.log('🧪 MM-02: Criar Vendor e vincular no Material')
  console.log('='.repeat(50))
  
  try {
    // 1. Criar vendor via API
    console.log('1️⃣ Criando vendor via API...')
    
    const vendorPayload = {
      vendor_id: 'VENDOR_E2E_1',
      vendor_name: 'Fornecedor E2E',
      email: 'fornecedor@e2e.com',
      telefone: '(11) 99999-9999',
      cidade: 'São Paulo',
      estado: 'SP',
      country: 'Brasil'
    }
    
    console.log('📤 Payload do vendor:', JSON.stringify(vendorPayload, null, 2))
    
    const response = await fetch(`${BASE_URL}/api/mm/vendors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendorPayload)
    })
    
    const result = await response.json()
    
    console.log(`📊 Status: ${response.status}`)
    console.log('📋 Resposta da API:', JSON.stringify(result, null, 2))
    
    if (!response.ok) {
      console.log('❌ FALHA: Erro na API de vendors:', result.error || 'Erro desconhecido')
      return { success: false, error: 'API de vendors falhou' }
    }
    
    if (!result.ok) {
      console.log('❌ FALHA: API retornou erro:', result.error || 'Erro desconhecido')
      return { success: false, error: 'API retornou erro' }
    }
    
    console.log('✅ Vendor criado com sucesso!')
    
    // 2. Verificar se vendor aparece na listagem
    console.log('\n2️⃣ Verificando listagem de vendors...')
    
    const listResponse = await fetch(`${BASE_URL}/api/mm/vendors`)
    const listResult = await listResponse.json()
    
    console.log(`📊 Status da listagem: ${listResponse.status}`)
    
    if (!listResponse.ok || !listResult.ok) {
      console.log('❌ FALHA: Erro na listagem de vendors:', listResult.error || 'Erro desconhecido')
      return { success: false, error: 'Listagem de vendors falhou' }
    }
    
    const vendors = listResult.items || []
    const createdVendor = vendors.find((v: any) => v.vendor_id === 'VENDOR_E2E_1')
    
    if (!createdVendor) {
      console.log('❌ FALHA: Vendor não encontrado na listagem!')
      return { success: false, error: 'Vendor não encontrado na listagem' }
    }
    
    console.log('✅ Vendor encontrado na listagem!')
    console.log('📋 Dados do vendor:', JSON.stringify(createdVendor, null, 2))
    
    // 3. Testar vinculação no material (simulação)
    console.log('\n3️⃣ Testando vinculação no material...')
    
    // Simular dados de material com vendor vinculado
    const materialWithVendor = {
      mm_desc: 'Material com Vendor E2E',
      commercial_name: 'Material Vendor Test',
      mm_mat_type: 'MAT',
      mm_mat_class: 'CLASS_A',
      mm_price_cents: 1000,
      mm_purchase_price_cents: 800,
      mm_vendor_id: 'VENDOR_E2E_1',
      unit_of_measure: 'unidade',
      status: 'active'
    }
    
    console.log('📤 Payload do material com vendor:', JSON.stringify(materialWithVendor, null, 2))
    
    const materialResponse = await fetch(`${BASE_URL}/api/mm/materials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(materialWithVendor)
    })
    
    const materialResult = await materialResponse.json()
    
    console.log(`📊 Status do material: ${materialResponse.status}`)
    console.log('📋 Resposta da API do material:', JSON.stringify(materialResult, null, 2))
    
    if (!materialResponse.ok || !materialResult.ok) {
      console.log('❌ FALHA: Erro ao criar material com vendor:', materialResult.error || 'Erro desconhecido')
      return { success: false, error: 'Material com vendor falhou' }
    }
    
    console.log('✅ Material com vendor criado com sucesso!')
    
    // SQL de conferência
    console.log('\n📊 SQL de conferência:')
    console.log(`
SELECT vendor_id FROM public.mm_vendor WHERE tenant_id='LaplataLunaria' AND vendor_id='VENDOR_E2E_1';
SELECT mm_vendor_id FROM public.mm_material WHERE tenant_id='LaplataLunaria' AND mm_material='${materialResult.data?.mm_material}';
    `)
    
    console.log('\n🎉 MM-02 CONCLUÍDO COM SUCESSO!')
    return { success: true, vendor_id: 'VENDOR_E2E_1', mm_material: materialResult.data?.mm_material }
    
  } catch (error) {
    console.log('❌ ERRO NO TESTE:', error)
    return { success: false, error: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error) }
  }
}

// Executar teste
testCreateVendor().then(result => {
  if (result.success) {
    console.log(`\n🚀 Vendor criado: ${result.vendor_id}`)
  } else {
    console.log(`\n⚠️  Teste falhou: ${result.error}`)
  }
  process.exit(result.success ? 0 : 1)
})
}



