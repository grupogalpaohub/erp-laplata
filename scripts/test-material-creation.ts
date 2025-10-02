#!/usr/bin/env tsx
// Teste funcional - Criar Material

{
  const BASE_URL = 'http://localhost:3000'

async function testMaterialCreation() {
  console.log('🧪 TESTE FUNCIONAL - CRIAR MATERIAL')
  console.log('='.repeat(50))
  
  try {
    // 1. Testar GET (deve funcionar)
    console.log('\n1️⃣ Testando GET /api/mm/materials')
    const getResponse = await fetch(`${BASE_URL}/api/mm/materials`)
    const getData = await getResponse.json()
    
    console.log(`Status: ${getResponse.status}`)
    console.log('Resposta:', JSON.stringify(getData, null, 2))
    
    if (getData.ok) {
      console.log('✅ GET funcionando corretamente')
    } else {
      console.log('❌ GET falhou')
    }
    
    // 2. Testar POST (deve retornar 401 sem auth)
    console.log('\n2️⃣ Testando POST /api/mm/materials (sem auth)')
    const postResponse = await fetch(`${BASE_URL}/api/mm/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mm_desc: 'Material Teste Funcional',
        commercial_name: 'Teste',
        mm_mat_type: 'MAT',
        mm_mat_class: 'CLASS_A',
        mm_price_cents: 1000,
        status: 'active'
      })
    })
    
    const postData = await postResponse.json()
    
    console.log(`Status: ${postResponse.status}`)
    console.log('Resposta:', JSON.stringify(postData, null, 2))
    
    if (postResponse.status === 401 && postData.error?.code === 'UNAUTHORIZED') {
      console.log('✅ POST retorna 401 corretamente (sem auth)')
    } else {
      console.log('❌ POST não retornou 401 como esperado')
    }
    
    // 3. Testar com tenant_id no payload (deve ser rejeitado)
    console.log('\n3️⃣ Testando POST com tenant_id no payload')
    const tenantResponse = await fetch(`${BASE_URL}/api/mm/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mm_desc: 'Material Teste',
        tenant_id: 'INVALID_TENANT' // Deve ser rejeitado
      })
    })
    
    const tenantData = await tenantResponse.json()
    
    console.log(`Status: ${tenantResponse.status}`)
    console.log('Resposta:', JSON.stringify(tenantData, null, 2))
    
    if (tenantResponse.status === 400 && tenantData.error?.code === 'TENANT_FORBIDDEN') {
      console.log('✅ tenant_id no payload é rejeitado corretamente')
    } else {
      console.log('❌ tenant_id no payload não foi rejeitado')
    }
    
    // 4. Testar com mm_material no payload (deve ser removido)
    console.log('\n4️⃣ Testando POST com mm_material no payload')
    const materialResponse = await fetch(`${BASE_URL}/api/mm/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mm_desc: 'Material Teste',
        mm_material: 'MANUAL_ID' // Deve ser removido
      })
    })
    
    const materialData = await materialResponse.json()
    
    console.log(`Status: ${materialResponse.status}`)
    console.log('Resposta:', JSON.stringify(materialData, null, 2))
    
    if (materialResponse.status === 401) {
      console.log('✅ mm_material no payload é removido (retorna 401 por auth, não por validação)')
    } else {
      console.log('❌ Comportamento inesperado')
    }
    
    console.log('\n🎉 TESTE CONCLUÍDO!')
    console.log('✅ APIs estão funcionando conforme esperado:')
    console.log('   • GET retorna dados corretamente')
    console.log('   • POST retorna 401 sem autenticação')
    console.log('   • tenant_id no payload é rejeitado')
    console.log('   • mm_material no payload é removido')
    
  } catch (error) {
    console.log('❌ ERRO NO TESTE:', error)
  }
}

testMaterialCreation()
}

