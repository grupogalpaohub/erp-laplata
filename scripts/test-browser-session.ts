#!/usr/bin/env tsx

// Script para testar se a sessão está funcionando no navegador
console.log('🔍 Testando sessão no navegador...')

// Simular requisição do navegador com cookies
async function testBrowserSession() {
  try {
    // 1. Testar se a página de materiais carrega (deve redirecionar para login se não autenticado)
    console.log('\n1. Testando página de materiais...')
    const materialsPageResponse = await fetch('http://localhost:3000/mm/materials', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    })
    
    console.log('Status:', materialsPageResponse.status)
    console.log('URL final:', materialsPageResponse.url)
    
    if (materialsPageResponse.status === 200) {
      const html = await materialsPageResponse.text()
      if (html.includes('admin@teste.com')) {
        console.log('✅ Usuário logado detectado na página')
      } else if (html.includes('login')) {
        console.log('❌ Redirecionado para login - usuário não autenticado')
      } else {
        console.log('❓ Status desconhecido')
      }
    }
    
    // 2. Testar API de materiais (deve funcionar se autenticado)
    console.log('\n2. Testando API de materiais...')
    const materialsApiResponse = await fetch('http://localhost:3000/api/mm/materials', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      }
    })
    
    console.log('Status:', materialsApiResponse.status)
    const apiData = await materialsApiResponse.json()
    console.log('Resposta:', JSON.stringify(apiData, null, 2))
    
    if (apiData.ok) {
      console.log('✅ API funcionando - usuário autenticado')
    } else if (apiData.error?.code === '42501') {
      console.log('❌ RLS bloqueando - sessão não sincronizada')
    } else {
      console.log('❓ Erro desconhecido:', apiData.error)
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

testBrowserSession()
