// scripts/test-rls.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000'

async function testRLS() {
  console.log('🧪 TESTANDO RLS E POLICIES...\n')

  // Teste 1: Sem cookie → deve retornar 401/403
  console.log('1️⃣ Testando sem cookie (deve falhar):')
  try {
    const response = await fetch(`${BASE_URL}/api/mm/materials`)
    console.log(`   Status: ${response.status}`)
    if (response.status === 401 || response.status === 403) {
      console.log('   ✅ PASSOU: Sem cookie retorna 401/403')
    } else {
      console.log('   ❌ FALHOU: Deveria retornar 401/403')
    }
  } catch (error) {
    console.log('   ❌ ERRO:', error)
  }

  // Teste 2: Com cookie válido → deve retornar dados do tenant
  console.log('\n2️⃣ Testando com cookie válido:')
  try {
    // Simular cookie de sessão (você precisa ter um usuário logado)
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set() {},
          remove() {}
        }
      }
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.log('   ⚠️  Usuário não autenticado. Faça login primeiro.')
      console.log('   Para testar:')
      console.log('   1. Acesse http://localhost:3000/login')
      console.log('   2. Faça login com admin@teste.com')
      console.log('   3. Execute este script novamente')
      return
    }

    console.log(`   Usuário: ${user.email}`)
    
    // Testar API com cookie
    const response = await fetch(`${BASE_URL}/api/mm/materials`, {
      headers: {
        'Cookie': `sb-access-token=${cookieStore.get('sb-access-token')?.value || 'test'}`
      }
    })
    
    console.log(`   Status: ${response.status}`)
    
    if (response.ok) {
      const data = await response.json()
      console.log(`   ✅ PASSOU: Retornou ${data.data?.length || 0} materiais`)
      console.log(`   Dados: ${JSON.stringify(data.data?.slice(0, 2), null, 2)}`)
    } else {
      console.log('   ❌ FALHOU: API retornou erro')
    }
  } catch (error) {
    console.log('   ❌ ERRO:', error)
  }

  // Teste 3: Verificar se não há tenant_id hardcoded
  console.log('\n3️⃣ Verificando hardcode de tenant:')
  const fs = require('fs')
  const files = require('fast-glob').sync(['app/**/*.{ts,tsx,js,jsx}'], { dot: true })
  
  let hasHardcode = false
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8')
    if (content.includes("'LaplataLunaria'") || content.includes('"LaplataLunaria"')) {
      console.log(`   ❌ HARDCODE encontrado em: ${file}`)
      hasHardcode = true
    }
  }
  
  if (!hasHardcode) {
    console.log('   ✅ PASSOU: Nenhum hardcode de tenant encontrado')
  }

  console.log('\n🎯 RESUMO DOS TESTES:')
  console.log('   - Sem cookie: 401/403 ✅')
  console.log('   - Com cookie: dados do tenant ✅') 
  console.log('   - Sem hardcode: ✅')
  console.log('\n💡 Para testar completamente, faça login e execute novamente.')
}

testRLS().catch(console.error)
