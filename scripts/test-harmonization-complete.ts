#!/usr/bin/env tsx
// Teste de harmonização completa - MM & SD

{
  const BASE_URL = 'http://localhost:3000'

async function testHarmonizationComplete() {
  console.log('🧪 TESTE DE HARMONIZAÇÃO COMPLETA - MM & SD')
  console.log('='.repeat(60))
  
  const results = {
    mm_material: null as string | null,
    vendor_id: null as string | null,
    mm_order: null as string | null,
    customer_id: null as string | null,
    so_id: null as string | null
  }
  
  try {
    // 1. Criar Material (sem mm_material no payload)
    console.log('\n1️⃣ TESTE: Criar Material (ID auto)')
    console.log('-'.repeat(40))
    
    const materialPayload = {
      mm_desc: 'Material Harmonização Test',
      commercial_name: 'Material Test',
      mm_mat_type: 'MAT',
      mm_mat_class: 'CLASS_A',
      mm_price_cents: 1000,
      mm_purchase_price_cents: 800,
      unit_of_measure: 'unidade',
      status: 'active'
    }
    
    console.log('📤 Payload (sem mm_material):', JSON.stringify(materialPayload, null, 2))
    
    const materialResponse = await fetch(`${BASE_URL}/api/mm/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(materialPayload)
    })
    
    const materialResult = await materialResponse.json()
    console.log(`📊 Status: ${materialResponse.status}`)
    console.log('📋 Resposta:', JSON.stringify(materialResult, null, 2))
    
    if (!materialResult.ok || !materialResult.data?.mm_material) {
      console.log('❌ FALHA: Material não criado ou mm_material não gerado')
      return { success: false, error: 'Material creation failed' }
    }
    
    results.mm_material = materialResult.data.mm_material
    console.log(`✅ Material criado: ${results.mm_material}`)
    
    // 2. Criar Vendor
    console.log('\n2️⃣ TESTE: Criar Vendor')
    console.log('-'.repeat(40))
    
    const vendorPayload = {
      vendor_id: 'VENDOR_HARMONIZATION',
      vendor_name: 'Fornecedor Harmonização',
      email: 'vendor@harmonization.com',
      country: 'Brasil'
    }
    
    console.log('📤 Payload do vendor:', JSON.stringify(vendorPayload, null, 2))
    
    const vendorResponse = await fetch(`${BASE_URL}/api/mm/vendors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendorPayload)
    })
    
    const vendorResult = await vendorResponse.json()
    console.log(`📊 Status: ${vendorResponse.status}`)
    console.log('📋 Resposta:', JSON.stringify(vendorResult, null, 2))
    
    if (!vendorResult.ok) {
      console.log('❌ FALHA: Vendor não criado')
      return { success: false, error: 'Vendor creation failed' }
    }
    
    results.vendor_id = 'VENDOR_HARMONIZATION'
    console.log(`✅ Vendor criado: ${results.vendor_id}`)
    
    // 3. Criar PO (sem mm_order no payload)
    console.log('\n3️⃣ TESTE: Criar PO (ID auto)')
    console.log('-'.repeat(40))
    
    const poPayload = {
      vendor_id: results.vendor_id,
      order_date: '2025-09-28',
      expected_delivery: '2025-10-05',
      notes: 'PO de harmonização'
    }
    
    console.log('📤 Payload (sem mm_order):', JSON.stringify(poPayload, null, 2))
    
    const poResponse = await fetch(`${BASE_URL}/api/mm/purchase-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(poPayload)
    })
    
    const poResult = await poResponse.json()
    console.log(`📊 Status: ${poResponse.status}`)
    console.log('📋 Resposta:', JSON.stringify(poResult, null, 2))
    
    if (!poResult.ok || !poResult.data?.mm_order) {
      console.log('❌ FALHA: PO não criado ou mm_order não gerado')
      return { success: false, error: 'PO creation failed' }
    }
    
    results.mm_order = poResult.data.mm_order
    console.log(`✅ PO criado: ${results.mm_order}`)
    
    // 4. Adicionar Item ao PO
    console.log('\n4️⃣ TESTE: Adicionar Item ao PO')
    console.log('-'.repeat(40))
    
    const poItemPayload = {
      mm_order: results.mm_order,
      mm_material: results.mm_material,
      mm_qtt: 2,
      unit_cost_cents: 500
    }
    
    console.log('📤 Payload do item:', JSON.stringify(poItemPayload, null, 2))
    
    const poItemResponse = await fetch(`${BASE_URL}/api/mm/purchase-order-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(poItemPayload)
    })
    
    const poItemResult = await poItemResponse.json()
    console.log(`📊 Status: ${poItemResponse.status}`)
    console.log('📋 Resposta:', JSON.stringify(poItemResult, null, 2))
    
    if (!poItemResult.ok) {
      console.log('❌ FALHA: Item do PO não criado')
      return { success: false, error: 'PO item creation failed' }
    }
    
    console.log('✅ Item do PO criado com sucesso!')
    
    // 5. Criar Customer
    console.log('\n5️⃣ TESTE: Criar Customer')
    console.log('-'.repeat(40))
    
    const customerPayload = {
      customer_id: 'CUSTOMER_HARMONIZATION',
      name: 'Cliente Harmonização',
      customer_type: 'PF',
      document_no: '123.456.789-00',
      status: 'active'
    }
    
    console.log('📤 Payload do customer:', JSON.stringify(customerPayload, null, 2))
    
    const customerResponse = await fetch(`${BASE_URL}/api/crm/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerPayload)
    })
    
    const customerResult = await customerResponse.json()
    console.log(`📊 Status: ${customerResponse.status}`)
    console.log('📋 Resposta:', JSON.stringify(customerResult, null, 2))
    
    if (!customerResult.ok) {
      console.log('❌ FALHA: Customer não criado')
      return { success: false, error: 'Customer creation failed' }
    }
    
    results.customer_id = 'CUSTOMER_HARMONIZATION'
    console.log(`✅ Customer criado: ${results.customer_id}`)
    
    // 6. Criar SO (sem so_id no payload)
    console.log('\n6️⃣ TESTE: Criar SO (ID auto)')
    console.log('-'.repeat(40))
    
    const soPayload = {
      customer_id: results.customer_id,
      order_date: '2025-09-28',
      expected_ship: '2025-10-01',
      payment_method: 'PIX',
      notes: 'SO de harmonização'
    }
    
    console.log('📤 Payload (sem so_id):', JSON.stringify(soPayload, null, 2))
    
    const soResponse = await fetch(`${BASE_URL}/api/sd/sales-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(soPayload)
    })
    
    const soResult = await soResponse.json()
    console.log(`📊 Status: ${soResponse.status}`)
    console.log('📋 Resposta:', JSON.stringify(soResult, null, 2))
    
    if (!soResult.ok || !soResult.data?.so_id) {
      console.log('❌ FALHA: SO não criado ou so_id não gerado')
      return { success: false, error: 'SO creation failed' }
    }
    
    results.so_id = soResult.data.so_id
    console.log(`✅ SO criado: ${results.so_id}`)
    
    // 7. Adicionar Item ao SO
    console.log('\n7️⃣ TESTE: Adicionar Item ao SO')
    console.log('-'.repeat(40))
    
    const soItemPayload = {
      so_id: results.so_id,
      mm_material: results.mm_material,
      quantity: 1,
      unit_price_cents: 1000
    }
    
    console.log('📤 Payload do item:', JSON.stringify(soItemPayload, null, 2))
    
    const soItemResponse = await fetch(`${BASE_URL}/api/sd/sales-order-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(soItemPayload)
    })
    
    const soItemResult = await soItemResponse.json()
    console.log(`📊 Status: ${soItemResponse.status}`)
    console.log('📋 Resposta:', JSON.stringify(soItemResult, null, 2))
    
    if (!soItemResult.ok) {
      console.log('❌ FALHA: Item do SO não criado')
      return { success: false, error: 'SO item creation failed' }
    }
    
    console.log('✅ Item do SO criado com sucesso!')
    
    // Relatório final
    console.log('\n🎉 HARMONIZAÇÃO COMPLETA - SUCESSO!')
    console.log('='.repeat(60))
    console.log('✅ Todos os testes passaram:')
    console.log(`   • Material criado: ${results.mm_material}`)
    console.log(`   • Vendor criado: ${results.vendor_id}`)
    console.log(`   • PO criado: ${results.mm_order}`)
    console.log(`   • Customer criado: ${results.customer_id}`)
    console.log(`   • SO criado: ${results.so_id}`)
    console.log('\n🚀 Sistema harmonizado e funcionando!')
    
    return { success: true, results }
    
  } catch (error) {
    console.log('❌ ERRO NO TESTE:', error)
    return { success: false, error: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error) }
  }
}

// Executar teste
testHarmonizationComplete().then(result => {
  if (result.success) {
    console.log('\n🎯 HARMONIZAÇÃO CONCLUÍDA COM SUCESSO!')
  } else {
    console.log(`\n⚠️  Teste falhou: ${result.error}`)
  }
  process.exit(result.success ? 0 : 1)
})
}

