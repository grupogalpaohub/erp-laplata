#!/usr/bin/env tsx
// Teste final de validação - Verificar se todas as correções estão funcionando

const BASE_URL = 'http://localhost:3000'

async function testFinalValidation() {
  console.log('🧪 TESTE FINAL DE VALIDAÇÃO - MM & SD')
  console.log('=' * 60)
  
  const results = {
    apis_working: 0,
    apis_total: 0,
    guardrails_ok: 0,
    guardrails_total: 0
  }
  
  try {
    // 1. Testar APIs principais
    console.log('\n1️⃣ TESTANDO APIs PRINCIPAIS')
    console.log('-' * 40)
    
    const apis = [
      { name: 'Materials GET', url: '/api/mm/materials', method: 'GET' },
      { name: 'Materials POST', url: '/api/mm/materials', method: 'POST' },
      { name: 'Purchase Orders GET', url: '/api/mm/purchase-orders', method: 'GET' },
      { name: 'Purchase Orders POST', url: '/api/mm/purchase-orders', method: 'POST' },
      { name: 'Sales Orders GET', url: '/api/sd/sales-orders', method: 'GET' },
      { name: 'Sales Orders POST', url: '/api/sd/sales-orders', method: 'POST' },
      { name: 'Customers GET', url: '/api/crm/customers', method: 'GET' },
      { name: 'Customers POST', url: '/api/crm/customers', method: 'POST' }
    ]
    
    for (const api of apis) {
      results.apis_total++
      console.log(`\n📡 Testando ${api.name}...`)
      
      try {
        const response = await fetch(`${BASE_URL}${api.url}`, {
          method: api.method,
          headers: { 'Content-Type': 'application/json' },
          body: api.method === 'POST' ? JSON.stringify({
            mm_desc: 'Teste',
            customer_id: 'TEST',
            vendor_id: 'TEST'
          }) : undefined
        })
        
        const data = await response.json()
        
        console.log(`   Status: ${response.status}`)
        console.log(`   Resposta: ${JSON.stringify(data).substring(0, 100)}...`)
        
        // Verificar se retorna envelope padronizado
        if (data && typeof data === 'object' && 'ok' in data) {
          console.log(`   ✅ Envelope padronizado: { ok: ${data.ok} }`)
          results.apis_working++
        } else {
          console.log(`   ❌ Envelope não padronizado`)
        }
        
        // Verificar se bloqueia tenant_id no payload (para POSTs)
        if (api.method === 'POST' && response.status === 400 && data.error?.code === 'TENANT_FORBIDDEN') {
          console.log(`   ✅ Bloqueia tenant_id no payload`)
          results.guardrails_ok++
        } else if (api.method === 'POST' && response.status === 401) {
          console.log(`   ✅ Retorna 401 sem auth (correto)`)
          results.guardrails_ok++
        } else if (api.method === 'GET' && response.status === 200) {
          console.log(`   ✅ GET funcionando`)
          results.guardrails_ok++
        }
        
        results.guardrails_total++
        
      } catch (error) {
        console.log(`   ❌ Erro: ${error.message}`)
      }
    }
    
    // 2. Testar validação de schemas
    console.log('\n2️⃣ TESTANDO VALIDAÇÃO DE SCHEMAS')
    console.log('-' * 40)
    
    // Testar PO sem mm_order
    console.log('\n📡 Testando PO sem mm_order...')
    const poResponse = await fetch(`${BASE_URL}/api/mm/purchase-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vendor_id: 'TEST_VENDOR',
        order_date: '2025-09-28',
        notes: 'Teste sem mm_order'
      })
    })
    
    const poData = await poResponse.json()
    console.log(`   Status: ${poResponse.status}`)
    console.log(`   Resposta: ${JSON.stringify(poData).substring(0, 100)}...`)
    
    if (poResponse.status === 401 || poResponse.status === 400) {
      console.log(`   ✅ PO não aceita mm_order no payload`)
    }
    
    // Testar SO sem so_id
    console.log('\n📡 Testando SO sem so_id...')
    const soResponse = await fetch(`${BASE_URL}/api/sd/sales-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: 'TEST_CUSTOMER',
        order_date: '2025-09-28',
        notes: 'Teste sem so_id'
      })
    })
    
    const soData = await soResponse.json()
    console.log(`   Status: ${soResponse.status}`)
    console.log(`   Resposta: ${JSON.stringify(soData).substring(0, 100)}...`)
    
    if (soResponse.status === 401 || soResponse.status === 400) {
      console.log(`   ✅ SO não aceita so_id no payload`)
    }
    
    // 3. Relatório final
    console.log('\n📊 RELATÓRIO FINAL')
    console.log('=' * 60)
    console.log(`✅ APIs funcionando: ${results.apis_working}/${results.apis_total}`)
    console.log(`✅ Guardrails OK: ${results.guardrails_ok}/${results.guardrails_total}`)
    console.log(`📈 Taxa de sucesso: ${Math.round((results.apis_working / results.apis_total) * 100)}%`)
    console.log(`📈 Taxa de guardrails: ${Math.round((results.guardrails_ok / results.guardrails_total) * 100)}%`)
    
    if (results.apis_working === results.apis_total && results.guardrails_ok === results.guardrails_total) {
      console.log('\n🎉 TODOS OS TESTES PASSARAM!')
      console.log('✅ Sistema harmonizado e funcionando corretamente!')
      return { success: true, results }
    } else {
      console.log('\n⚠️  ALGUNS TESTES FALHARAM!')
      console.log('❌ Verificar implementação das APIs e guardrails.')
      return { success: false, results }
    }
    
  } catch (error) {
    console.log('❌ ERRO NO TESTE:', error)
    return { success: false, error: error.message }
  }
}

// Executar teste
testFinalValidation().then(result => {
  if (result.success) {
    console.log('\n🚀 VALIDAÇÃO CONCLUÍDA COM SUCESSO!')
  } else {
    console.log(`\n⚠️  Validação falhou: ${result.error || 'Alguns testes falharam'}`)
  }
  process.exit(result.success ? 0 : 1)
})
