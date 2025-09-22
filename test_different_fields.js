const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testDifferentFields() {
  try {
    console.log('🔍 Testando diferentes campos para inserir item...');
    
    // Tentar com campo 'quantity' em vez de 'mm_qtt'
    const testItem1 = {
      mm_order: 'PO-000001',
      plant_id: 'DEFAULT',
      mm_material: 'B_176',
      quantity: 1,  // Usando 'quantity' em vez de 'mm_qtt'
      unit_cost_cents: 360000,
      line_total_cents: 360000
    };
    
    console.log('📝 Tentativa 1 - com campo "quantity":', testItem1);
    
    const { data: data1, error: error1 } = await supabase
      .from('mm_purchase_order_item')
      .insert([testItem1])
      .select('*');
    
    if (error1) {
      console.log('❌ Erro com "quantity":', error1.message);
    } else {
      console.log('✅ Sucesso com "quantity":', data1[0]);
      return;
    }
    
    // Tentar com campos mínimos
    const testItem2 = {
      mm_order: 'PO-000001',
      mm_material: 'B_176',
      mm_qtt: 1
    };
    
    console.log('');
    console.log('📝 Tentativa 2 - campos mínimos:', testItem2);
    
    const { data: data2, error: error2 } = await supabase
      .from('mm_purchase_order_item')
      .insert([testItem2])
      .select('*');
    
    if (error2) {
      console.log('❌ Erro com campos mínimos:', error2.message);
    } else {
      console.log('✅ Sucesso com campos mínimos:', data2[0]);
      return;
    }
    
    // Tentar sem plant_id
    const testItem3 = {
      mm_order: 'PO-000001',
      mm_material: 'B_176',
      mm_qtt: 1,
      unit_cost_cents: 360000,
      line_total_cents: 360000
    };
    
    console.log('');
    console.log('📝 Tentativa 3 - sem plant_id:', testItem3);
    
    const { data: data3, error: error3 } = await supabase
      .from('mm_purchase_order_item')
      .insert([testItem3])
      .select('*');
    
    if (error3) {
      console.log('❌ Erro sem plant_id:', error3.message);
    } else {
      console.log('✅ Sucesso sem plant_id:', data3[0]);
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

testDifferentFields();
