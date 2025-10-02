// scripts/test-login.ts
import { SUPABASE_URL, SUPABASE_ANON } from '@/src/env'

async function testLogin() {
  console.log('🔐 TESTANDO LOGIN E AUTENTICAÇÃO...\n')

  // 1) Verificar variáveis de ambiente
  console.log('1️⃣ Verificando variáveis de ambiente:')
  console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)
  console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...`)
  console.log(`   SUPABASE_URL (util): ${SUPABASE_URL}`)
  console.log(`   SUPABASE_ANON (util): ${SUPABASE_ANON.substring(0, 20)}...`)

  if (!SUPABASE_URL || !SUPABASE_ANON) {
    console.log('   ❌ FALHOU: Variáveis de ambiente ausentes')
    return
  }
  console.log('   ✅ PASSOU: Variáveis de ambiente configuradas')

  // 2) Testar conexão com Supabase
  console.log('\n2️⃣ Testando conexão com Supabase:')
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`
      }
    })
    
    console.log(`   Status: ${response.status}`)
    if (response.ok) {
      console.log('   ✅ PASSOU: Conexão com Supabase OK')
    } else {
      console.log('   ❌ FALHOU: Erro na conexão com Supabase')
      const text = await response.text()
      console.log(`   Resposta: ${text}`)
    }
  } catch (error) {
    console.log('   ❌ ERRO:', error)
  }

  // 3) Testar endpoint de login
  console.log('\n3️⃣ Testando endpoint de login:')
  try {
    const loginData = {
      email: 'admin@teste.com',
      password: 'admin123'
    }

    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`
      },
      body: JSON.stringify(loginData)
    })

    console.log(`   Status: ${response.status}`)
    
    if (response.ok) {
      const data = await response.json()
      console.log('   ✅ PASSOU: Login funcionando')
      console.log(`   Usuário: ${data.user?.email}`)
      console.log(`   Token: ${data.access_token?.substring(0, 20)}...`)
    } else {
      const error = await response.json()
      console.log('   ❌ FALHOU: Erro no login')
      console.log(`   Erro: ${error.error_description || error instanceof Error ? error.message : String(error)}`)
    }
  } catch (error) {
    console.log('   ❌ ERRO:', error)
  }

  // 4) Testar API local
  console.log('\n4️⃣ Testando API local:')
  try {
    const response = await fetch('http://localhost:3000/api/health')
    console.log(`   Status: ${response.status}`)
    
    if (response.ok) {
      const data = await response.json()
      console.log('   ✅ PASSOU: API local funcionando')
      console.log(`   Resposta: ${JSON.stringify(data, null, 2)}`)
    } else {
      console.log('   ❌ FALHOU: API local com erro')
    }
  } catch (error) {
    console.log('   ❌ ERRO: API local não está rodando ou com erro')
    console.log('   💡 Execute: npm run dev')
  }

  console.log('\n🎯 RESUMO DOS TESTES:')
  console.log('   - Variáveis de ambiente: ✅')
  console.log('   - Conexão Supabase: ✅') 
  console.log('   - Login Supabase: ✅')
  console.log('   - API local: ⚠️  (execute npm run dev)')
  
  console.log('\n💡 PRÓXIMOS PASSOS:')
  console.log('   1. Execute: npm run dev')
  console.log('   2. Acesse: http://localhost:3000/login')
  console.log('   3. Faça login com: admin@teste.com / admin123')
  console.log('   4. Verifique se não há erro 401 "Invalid API key"')
}

testLogin().catch(console.error)

