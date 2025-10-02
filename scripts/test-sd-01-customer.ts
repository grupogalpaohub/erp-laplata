#!/usr/bin/env tsx
// SD-01: Criar Customer

{
  const BASE_URL = 'http://localhost:3000'

async function testCreateCustomer() {
  console.log('🧪 SD-01: Criar Customer')
  console.log('='.repeat(50))
  
  try {
    // 1. Criar customer via API
    console.log('1️⃣ Criando customer via API...')
    
    const customerPayload = {
      customer_id: 'CUSTOMER_E2E_1',
      name: 'Cliente E2E',
      customer_type: 'PF',
      document_no: '123.456.789-00',
      contact_email: 'cliente@e2e.com',
      contact_phone: '(11) 99999-9999',
      status: 'active'
    }
    
    console.log('📤 Payload do customer:', JSON.stringify(customerPayload, null, 2))
    
    const response = await fetch(`${BASE_URL}/api/crm/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerPayload)
    })
    
    const result = await response.json()
    
    console.log(`📊 Status: ${response.status}`)
    console.log('📋 Resposta da API:', JSON.stringify(result, null, 2))
    
    if (!response.ok) {
      console.log('❌ FALHA: Erro na API de customers:', result.error || 'Erro desconhecido')
      return { success: false, error: 'API de customers falhou' }
    }
    
    if (!result.ok) {
      console.log('❌ FALHA: API retornou erro:', result.error || 'Erro desconhecido')
      return { success: false, error: 'API retornou erro' }
    }
    
    console.log('✅ Customer criado com sucesso!')
    
    // 2. Verificar se customer aparece na listagem
    console.log('\n2️⃣ Verificando listagem de customers...')
    
    const listResponse = await fetch(`${BASE_URL}/api/crm/customers`)
    const listResult = await listResponse.json()
    
    console.log(`📊 Status da listagem: ${listResponse.status}`)
    
    if (!listResponse.ok || !listResult.ok) {
      console.log('❌ FALHA: Erro na listagem de customers:', listResult.error || 'Erro desconhecido')
      return { success: false, error: 'Listagem de customers falhou' }
    }
    
    const customers = listResult.data || []
    const createdCustomer = customers.find((c: any) => c.customer_id === 'CUSTOMER_E2E_1')
    
    if (!createdCustomer) {
      console.log('❌ FALHA: Customer não encontrado na listagem!')
      return { success: false, error: 'Customer não encontrado na listagem' }
    }
    
    console.log('✅ Customer encontrado na listagem!')
    console.log('📋 Dados do customer:', JSON.stringify(createdCustomer, null, 2))
    
    // SQL de conferência
    console.log('\n📊 SQL de conferência:')
    console.log(`
SELECT tenant_id, customer_id, name
FROM public.crm_customer
WHERE tenant_id='LaplataLunaria' AND customer_id='CUSTOMER_E2E_1';
    `)
    
    console.log('\n🎉 SD-01 CONCLUÍDO COM SUCESSO!')
    return { success: true, customer_id: 'CUSTOMER_E2E_1' }
    
  } catch (error) {
    console.log('❌ ERRO NO TESTE:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// Executar teste
testCreateCustomer().then(result => {
  if (result.success) {
    console.log(`\n🚀 Customer criado: ${result.customer_id}`)
  } else {
    console.log(`\n⚠️  Teste falhou: ${result.error}`)
  }
  process.exit(result.success ? 0 : 1)
})
}



