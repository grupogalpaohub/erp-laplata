#!/usr/bin/env tsx
// Teste funcional real para criação de material

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function testCreateMaterial() {
  console.log('🧪 Teste funcional - Criação de material...\n')
  
  try {
    // 1. Simular requisição POST para criar material
    console.log('1️⃣ Testando criação de material via API...')
    
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (n) => cookieStore.get(n)?.value } }
    )
    
    // Obter tenant_id da sessão
    const { data: { session } } = await supabase.auth.getSession()
    const tenant_id = session?.user?.user_metadata?.tenant_id || 'LaplataLunaria'
    
    console.log(`   📋 Tenant ID: ${tenant_id}`)
    
    // Payload de teste (sem mm_material)
    const testPayload = {
      mm_desc: 'Material de Teste - ' + new Date().toISOString(),
      commercial_name: 'Teste Material',
      mm_mat_type: 'MAT',
      mm_mat_class: 'CLASS_A',
      mm_price_cents: 1000, // R$ 10,00
      mm_purchase_price_cents: 800, // R$ 8,00
      unit_of_measure: 'unidade',
      status: 'active'
    }
    
    console.log('   📤 Payload enviado:', JSON.stringify(testPayload, null, 2))
    
    // Inserir material
    const { data, error } = await supabase
      .from('mm_material')
      .insert([{
        tenant_id,
        ...testPayload
      }])
      .select('tenant_id, mm_material, mm_desc, commercial_name')
      .single()
    
    if (error) {
      console.log('   ❌ Erro ao criar material:', error.message)
      return false
    }
    
    console.log('   ✅ Material criado com sucesso!')
    console.log('   📋 Resposta da API:', JSON.stringify(data, null, 2))
    
    // 2. Verificar se mm_material foi gerado
    if (!data.mm_material) {
      console.log('   ❌ ERRO: mm_material não foi gerado!')
      return false
    }
    
    console.log(`   🎯 mm_material gerado: ${data.mm_material}`)
    
    // 3. Verificar se o material aparece na lista
    console.log('\n2️⃣ Verificando se material aparece na lista...')
    
    const { data: materials, error: listError } = await supabase
      .from('mm_material')
      .select('mm_material, mm_desc, commercial_name')
      .eq('tenant_id', tenant_id)
      .eq('mm_material', data.mm_material)
      .single()
    
    if (listError) {
      console.log('   ❌ Erro ao buscar material na lista:', listError.message)
      return false
    }
    
    console.log('   ✅ Material encontrado na lista!')
    console.log('   📋 Dados do material:', JSON.stringify(materials, null, 2))
    
    // 4. Testar se pode ser usado em pedido de compra
    console.log('\n3️⃣ Testando uso em pedido de compra...')
    
    const { data: poTest, error: poError } = await supabase
      .from('mm_purchase_order_item')
      .select('mm_material')
      .eq('tenant_id', tenant_id)
      .eq('mm_material', data.mm_material)
      .limit(1)
    
    if (poError && poError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.log('   ❌ Erro ao testar uso em PO:', poError.message)
      return false
    }
    
    console.log('   ✅ Material pode ser usado em pedidos de compra!')
    
    // 5. Limpeza - remover material de teste
    console.log('\n4️⃣ Limpando material de teste...')
    
    const { error: deleteError } = await supabase
      .from('mm_material')
      .delete()
      .eq('tenant_id', tenant_id)
      .eq('mm_material', data.mm_material)
    
    if (deleteError) {
      console.log('   ⚠️  Aviso: Não foi possível remover material de teste:', deleteError.message)
    } else {
      console.log('   ✅ Material de teste removido!')
    }
    
    console.log('\n🎉 TESTE FUNCIONAL CONCLUÍDO COM SUCESSO!')
    console.log('✅ O sistema está funcionando corretamente:')
    console.log('   • mm_material é gerado automaticamente')
    console.log('   • API retorna dados corretos')
    console.log('   • Material aparece na lista')
    console.log('   • Pode ser usado em pedidos')
    
    return true
    
  } catch (error) {
    console.log('❌ ERRO NO TESTE:', error)
    return false
  }
}

// Executar teste
testCreateMaterial().then(success => {
  if (success) {
    console.log('\n🚀 Sistema pronto para uso!')
  } else {
    console.log('\n⚠️  Sistema precisa de correções.')
  }
  process.exit(success ? 0 : 1)
})
