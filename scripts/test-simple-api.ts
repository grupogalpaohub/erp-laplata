#!/usr/bin/env tsx
// Teste simples para diagnosticar APIs

const BASE_URL = 'http://localhost:3000'

async function testSimpleAPI() {
  console.log('🧪 TESTE SIMPLES DE API')
  console.log('=' * 40)
  
  try {
    // Testar GET de materials
    console.log('\n1️⃣ Testando GET /api/mm/materials')
    const getResponse = await fetch(`${BASE_URL}/api/mm/materials`)
    console.log(`Status: ${getResponse.status}`)
    
    const getText = await getResponse.text()
    console.log('Response text:', getText)
    
    if (getText) {
      try {
        const getData = JSON.parse(getText)
        console.log('Parsed data:', JSON.stringify(getData, null, 2))
      } catch (e) {
        console.log('❌ Erro ao fazer parse do JSON:', e.message)
      }
    }
    
    // Testar POST de materials
    console.log('\n2️⃣ Testando POST /api/mm/materials')
    const postResponse = await fetch(`${BASE_URL}/api/mm/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mm_desc: 'Teste Simples',
        commercial_name: 'Teste',
        mm_mat_type: 'MAT',
        mm_mat_class: 'CLASS_A',
        mm_price_cents: 1000,
        status: 'active'
      })
    })
    
    console.log(`Status: ${postResponse.status}`)
    
    const postText = await postResponse.text()
    console.log('Response text:', postText)
    
    if (postText) {
      try {
        const postData = JSON.parse(postText)
        console.log('Parsed data:', JSON.stringify(postData, null, 2))
      } catch (e) {
        console.log('❌ Erro ao fazer parse do JSON:', e.message)
      }
    }
    
  } catch (error) {
    console.log('❌ ERRO:', error)
  }
}

testSimpleAPI()
