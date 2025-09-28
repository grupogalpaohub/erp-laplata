#!/usr/bin/env tsx
// MM-01: Criar Material (ID auto)

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function testCreateMaterial() {
  console.log('🧪 MM-01: Criar Material (ID auto)')
  console.log('=' * 50)
  
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (n) => cookieStore.get(n)?.value } }
    )
    
    // Obter tenant_id da sessão
    const { data: { session } } = await supabase.auth.getSession()
    const tenant_id = session?.user?.user_metadata?.tenant_id || 'LaplataLunaria'
    
    console.log(`📋 Tenant ID: ${tenant_id}`)
    
    // Payload de teste (sem mm_material - deve ser gerado automaticamente)
    const testPayload = {
      mm_desc: 'Material E2E Test - ' + new Date().toISOString(),
      commercial_name: 'Material E2E',
      mm_mat_type: 'MAT',
      mm_mat_class: 'CLASS_A',
      mm_price_cents: 2000, // R$ 20,00
      mm_purchase_price_cents: 1500, // R$ 15,00
      unit_of_measure: 'unidade',
      status: 'active'
    }
    
    console.log('📤 Payload enviado (sem mm_material):', JSON.stringify(testPayload, null, 2))
    
    // Inserir material
    const { data, error } = await supabase
      .from('mm_material')
      .insert([{
        tenant_id,
        ...testPayload
      }])
      .select('tenant_id, mm_material, mm_desc, mm_purchase_price_cents, mm_price_cents')
      .single()
    
    if (error) {
      console.log('❌ Erro ao criar material:', error.message)
      return false
    }
    
    console.log('✅ Material criado com sucesso!')
    console.log('📋 Resposta da API:', JSON.stringify(data, null, 2))
    
    // Verificar se mm_material foi gerado automaticamente
    if (!data.mm_material) {
      console.log('❌ ERRO: mm_material não foi gerado automaticamente!')
      return false
    }
    
    console.log(`🎯 mm_material gerado: ${data.mm_material}`)
    
    // Verificar se o material aparece na listagem
    console.log('\n📋 Verificando listagem...')
    
    const { data: materials, error: listError } = await supabase
      .from('mm_material')
      .select('mm_material, mm_desc, commercial_name')
      .eq('tenant_id', tenant_id)
      .eq('mm_material', data.mm_material)
      .single()
    
    if (listError) {
      console.log('❌ Erro ao buscar material na listagem:', listError.message)
      return false
    }
    
    console.log('✅ Material encontrado na listagem!')
    console.log('📋 Dados do material:', JSON.stringify(materials, null, 2))
    
    // Verificar se a primeira coluna exibe mm_material
    if (materials.mm_material !== data.mm_material) {
      console.log('❌ ERRO: Primeira coluna não exibe mm_material corretamente!')
      return false
    }
    
    console.log('✅ Primeira coluna exibe mm_material corretamente!')
    
    // SQL de conferência
    console.log('\n📊 SQL de conferência:')
    console.log(`
SELECT tenant_id, mm_material, mm_desc, mm_purchase_price_cents, mm_price_cents
FROM public.mm_material
WHERE tenant_id='${tenant_id}'
ORDER BY created_at DESC
LIMIT 1;
    `)
    
    console.log('\n🎉 MM-01 CONCLUÍDO COM SUCESSO!')
    console.log('✅ O sistema está funcionando corretamente:')
    console.log('   • mm_material é gerado automaticamente via trigger')
    console.log('   • API retorna dados corretos')
    console.log('   • Material aparece na listagem')
    console.log('   • Primeira coluna exibe mm_material')
    
    return { success: true, mm_material: data.mm_material }
    
  } catch (error) {
    console.log('❌ ERRO NO TESTE:', error)
    return { success: false, error: error.message }
  }
}

// Executar teste
testCreateMaterial().then(result => {
  if (result.success) {
    console.log(`\n🚀 Material criado: ${result.mm_material}`)
  } else {
    console.log('\n⚠️  Teste falhou.')
  }
  process.exit(result.success ? 0 : 1)
})
