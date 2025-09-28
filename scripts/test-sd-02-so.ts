#!/usr/bin/env tsx
// SD-02: Criar Sales Order (SO)

const BASE_URL = 'http://localhost:3000'

async function testCreateSO() {
  console.log('🧪 SD-02: Criar Sales Order (SO)')
  console.log('=' * 50)
  
  try {
    // 1. Criar SO via API
    console.log('1️⃣ Criando SO via API...')
    
    const soPayload = {
      customer_id: 'CUSTOMER_E2E_1',
      order_date: '2025-09-28',
      expected_ship: '2025-10-01',
      payment_method: 'PIX',
      payment_term: '30',
      notes: 'SO de teste E2E'
    }
    
    console.log('📤 Payload do SO:', JSON.stringify(soPayload, null, 2))
    
    const response = await fetch(`${BASE_URL}/api/sd/sales-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(soPayload)
    })
    
    const result = await response.json()
    
    console.log(`📊 Status: ${response.status}`)
    console.log('📋 Resposta da API:', JSON.stringify(result, null, 2))
    
    if (!response.ok) {
      console.log('❌ FALHA: Erro na API de SOs:', result.error || 'Erro desconhecido')
      return { success: false, error: 'API de SOs falhou' }
    }
    
    if (!result.ok) {
      console.log('❌ FALHA: API retornou erro:', result.error || 'Erro desconhecido')
      return { success: false, error: 'API retornou erro' }
    }
    
    if (!result.data || !result.data.so_id) {
      console.log('❌ FALHA: so_id não foi gerado!')
      return { success: false, error: 'so_id não gerado' }
    }
    
    console.log('✅ SO criado com sucesso!')
    console.log(`🎯 so_id gerado: ${result.data.so_id}`)
    
    // 2. Verificar se SO aparece na listagem
    console.log('\n2️⃣ Verificando listagem de SOs...')
    
    const listResponse = await fetch(`${BASE_URL}/api/sd/sales-orders`)
    const listResult = await listResponse.json()
    
    console.log(`📊 Status da listagem: ${listResponse.status}`)
    
    if (!listResponse.ok || !listResult.ok) {
      console.log('❌ FALHA: Erro na listagem de SOs:', listResult.error || 'Erro desconhecido')
      return { success: false, error: 'Listagem de SOs falhou' }
    }
    
    const sos = listResult.data || []
    const createdSO = sos.find((s: any) => s.so_id === result.data.so_id)
    
    if (!createdSO) {
      console.log('❌ FALHA: SO não encontrado na listagem!')
      return { success: false, error: 'SO não encontrado na listagem' }
    }
    
    console.log('✅ SO encontrado na listagem!')
    console.log('📋 Dados do SO:', JSON.stringify(createdSO, null, 2))
    
    // SQL de conferência
    console.log('\n📊 SQL de conferência:')
    console.log(`
SELECT tenant_id, so_id, customer_id, status
FROM public.sd_sales_order
WHERE tenant_id='LaplataLunaria'
ORDER BY created_at DESC LIMIT 1;
    `)
    
    console.log('\n🎉 SD-02 CONCLUÍDO COM SUCESSO!')
    return { success: true, so_id: result.data.so_id }
    
  } catch (error) {
    console.log('❌ ERRO NO TESTE:', error)
    return { success: false, error: error.message }
  }
}

// Executar teste
testCreateSO().then(result => {
  if (result.success) {
    console.log(`\n🚀 SO criado: ${result.so_id}`)
  } else {
    console.log(`\n⚠️  Teste falhou: ${result.error}`)
  }
  process.exit(result.success ? 0 : 1)
})
