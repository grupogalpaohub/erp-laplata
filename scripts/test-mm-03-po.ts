#!/usr/bin/env tsx
// MM-03: Criar Pedido de Compras (PO)

{
  const BASE_URL = 'http://localhost:3000'

async function testCreatePO() {
  console.log('🧪 MM-03: Criar Pedido de Compras (PO)')
  console.log('='.repeat(50))
  
  try {
    // 1. Criar PO via API
    console.log('1️⃣ Criando PO via API...')
    
    const poPayload = {
      vendor_id: 'VENDOR_E2E_1',
      order_date: '2025-09-28',
      expected_delivery: '2025-10-05',
      currency: 'BRL',
      notes: 'PO de teste E2E'
    }
    
    console.log('📤 Payload do PO:', JSON.stringify(poPayload, null, 2))
    
    const response = await fetch(`${BASE_URL}/api/mm/purchase-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(poPayload)
    })
    
    const result = await response.json()
    
    console.log(`📊 Status: ${response.status}`)
    console.log('📋 Resposta da API:', JSON.stringify(result, null, 2))
    
    if (!response.ok) {
      console.log('❌ FALHA: Erro na API de POs:', result.error || 'Erro desconhecido')
      return { success: false, error: 'API de POs falhou' }
    }
    
    if (!result.ok) {
      console.log('❌ FALHA: API retornou erro:', result.error || 'Erro desconhecido')
      return { success: false, error: 'API retornou erro' }
    }
    
    if (!result.data || !result.data.mm_order) {
      console.log('❌ FALHA: mm_order não foi gerado!')
      return { success: false, error: 'mm_order não gerado' }
    }
    
    console.log('✅ PO criado com sucesso!')
    console.log(`🎯 mm_order gerado: ${result.data.mm_order}`)
    
    // 2. Verificar se PO aparece na listagem
    console.log('\n2️⃣ Verificando listagem de POs...')
    
    const listResponse = await fetch(`${BASE_URL}/api/mm/purchase-orders`)
    const listResult = await listResponse.json()
    
    console.log(`📊 Status da listagem: ${listResponse.status}`)
    
    if (!listResponse.ok || !listResult.ok) {
      console.log('❌ FALHA: Erro na listagem de POs:', listResult.error || 'Erro desconhecido')
      return { success: false, error: 'Listagem de POs falhou' }
    }
    
    const pos = listResult.data || []
    const createdPO = pos.find((p: any) => p.mm_order === result.data.mm_order)
    
    if (!createdPO) {
      console.log('❌ FALHA: PO não encontrado na listagem!')
      return { success: false, error: 'PO não encontrado na listagem' }
    }
    
    console.log('✅ PO encontrado na listagem!')
    console.log('📋 Dados do PO:', JSON.stringify(createdPO, null, 2))
    
    // 3. Testar acesso à página de detalhes
    console.log('\n3️⃣ Testando acesso à página de detalhes...')
    
    const detailResponse = await fetch(`${BASE_URL}/api/mm/purchase-orders?mm_order=${result.data.mm_order}`)
    const detailResult = await detailResponse.json()
    
    console.log(`📊 Status do detalhe: ${detailResponse.status}`)
    console.log('📋 Resposta do detalhe:', JSON.stringify(detailResult, null, 2))
    
    if (!detailResponse.ok || !detailResult.ok) {
      console.log('❌ FALHA: Erro ao acessar detalhes do PO:', detailResult.error || 'Erro desconhecido')
      return { success: false, error: 'Detalhes do PO falharam' }
    }
    
    console.log('✅ Detalhes do PO acessados com sucesso!')
    
    // SQL de conferência
    console.log('\n📊 SQL de conferência:')
    console.log(`
SELECT tenant_id, mm_order, vendor_id, status, order_date, expected_delivery
FROM public.mm_purchase_order
WHERE tenant_id='LaplataLunaria'
ORDER BY created_at DESC LIMIT 1;
    `)
    
    console.log('\n🎉 MM-03 CONCLUÍDO COM SUCESSO!')
    return { success: true, mm_order: result.data.mm_order }
    
  } catch (error) {
    console.log('❌ ERRO NO TESTE:', error)
    return { success: false, error: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error) }
  }
}

// Executar teste
testCreatePO().then(result => {
  if (result.success) {
    console.log(`\n🚀 PO criado: ${result.mm_order}`)
  } else {
    console.log(`\n⚠️  Teste falhou: ${result.error}`)
  }
  process.exit(result.success ? 0 : 1)
})
}



