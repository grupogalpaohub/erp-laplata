const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testWithExistingPO() {
  try {
    console.log('🔍 Testando com pedido existente PO-2025-001...');
    
    // Usar um pedido que já existe
    const testItem = {
      tenant_id: 'LaplataLunaria',
      mm_order: 'PO-2025-001',  // Usar pedido existente
      plant_id: 'WH-001',
      mm_material: 'B_176',
      mm_qtt: 1,
      unit_cost_cents: 360000,
      line_total_cents: 360000,
      currency: 'BRL'
    };
    
    console.log('📝 Item de teste:', testItem);
    
    const { data, error } = await supabase
      .from('mm_purchase_order_item')
      .insert([testItem])
      .select('*');
    
    if (error) {
      console.log('❌ Erro:', error);
    } else {
      console.log('✅ Sucesso! Item inserido:', data[0]);
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

testWithExistingPO();
