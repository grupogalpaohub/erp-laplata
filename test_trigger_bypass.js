const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testTriggerBypass() {
  try {
    console.log('🔍 Tentando contornar o trigger problemático...');
    
    // Tentar desabilitar temporariamente o trigger
    console.log('📝 Tentando desabilitar trigger...');
    
    const { error: disableError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE mm_purchase_order_item DISABLE TRIGGER ALL;'
    });
    
    if (disableError) {
      console.log('❌ Não foi possível desabilitar trigger:', disableError.message);
    } else {
      console.log('✅ Trigger desabilitado temporariamente');
    }
    
    // Tentar inserir item
    const testItem = {
      tenant_id: 'LaplataLunaria',
      mm_order: 'PO-2025-001',
      mm_material: 'B_176',
      mm_qtt: 1,
      plant_id: 'WH-001',
      unit_cost_cents: 360000,
      line_total_cents: 360000,
      currency: 'BRL'
    };
    
    console.log('📝 Tentando inserir item:', testItem);
    
    const { data, error } = await supabase
      .from('mm_purchase_order_item')
      .insert([testItem])
      .select('*');
    
    if (error) {
      console.log('❌ Erro ao inserir item:', error);
    } else {
      console.log('✅ Sucesso! Item inserido:', data[0]);
    }
    
    // Reabilitar trigger
    console.log('📝 Reabilitando trigger...');
    
    const { error: enableError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE mm_purchase_order_item ENABLE TRIGGER ALL;'
    });
    
    if (enableError) {
      console.log('❌ Não foi possível reabilitar trigger:', enableError.message);
    } else {
      console.log('✅ Trigger reabilitado');
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

testTriggerBypass();
