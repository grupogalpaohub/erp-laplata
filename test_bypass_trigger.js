const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testBypassTrigger() {
  try {
    console.log('🔍 Tentando contornar o trigger problemático...');
    
    // Tentar inserir sem alguns campos que podem estar causando o problema
    const minimalItem = {
      tenant_id: 'LaplataLunaria',
      mm_order: 'PO-2025-001',
      mm_material: 'B_176',
      mm_qtt: 1,
      plant_id: 'WH-001'
    };
    
    console.log('📝 Item mínimo:', minimalItem);
    
    const { data, error } = await supabase
      .from('mm_purchase_order_item')
      .insert([minimalItem])
      .select('*');
    
    if (error) {
      console.log('❌ Erro com item mínimo:', error);
      
      // Tentar com apenas os campos essenciais
      console.log('');
      console.log('🔍 Tentando com apenas campos essenciais...');
      
      const essentialItem = {
        tenant_id: 'LaplataLunaria',
        mm_order: 'PO-2025-001',
        mm_material: 'B_176',
        mm_qtt: 1
      };
      
      console.log('📝 Item essencial:', essentialItem);
      
      const { data: essData, error: essError } = await supabase
        .from('mm_purchase_order_item')
        .insert([essentialItem])
        .select('*');
      
      if (essError) {
        console.log('❌ Erro com item essencial:', essError);
        
        // Tentar com campos diferentes
        console.log('');
        console.log('🔍 Tentando com campos diferentes...');
        
        const differentItem = {
          tenant_id: 'LaplataLunaria',
          mm_order: 'PO-2025-001',
          mm_material: 'B_176',
          quantity: 1,
          plant_id: 'WH-001'
        };
        
        console.log('📝 Item diferente:', differentItem);
        
        const { data: diffData, error: diffError } = await supabase
          .from('mm_purchase_order_item')
          .insert([differentItem])
          .select('*');
        
        if (diffError) {
          console.log('❌ Erro com item diferente:', diffError);
        } else {
          console.log('✅ Sucesso com item diferente:', diffData[0]);
        }
        
      } else {
        console.log('✅ Sucesso com item essencial:', essData[0]);
      }
      
    } else {
      console.log('✅ Sucesso com item mínimo:', data[0]);
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

testBypassTrigger();
