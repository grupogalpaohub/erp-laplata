const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkPOItemStructure() {
  try {
    console.log('🔍 Verificando estrutura da tabela mm_purchase_order_item...');
    
    // Tentar inserir um item de teste para ver o erro detalhado
    const testItem = {
      mm_order: 'PO-000001',
      plant_id: 'DEFAULT',
      mm_material: 'B_176',
      mm_qtt: 1,
      unit_cost_cents: 360000,
      line_total_cents: 360000
    };
    
    console.log('📝 Tentando inserir item de teste:', testItem);
    
    const { data, error } = await supabase
      .from('mm_purchase_order_item')
      .insert([testItem])
      .select('*');
    
    if (error) {
      console.log('❌ Erro detalhado:', error);
      console.log('📋 Código do erro:', error.code);
      console.log('📋 Detalhes:', error.details);
      console.log('📋 Hint:', error.hint);
    } else {
      console.log('✅ Item inserido com sucesso:', data);
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

checkPOItemStructure();
