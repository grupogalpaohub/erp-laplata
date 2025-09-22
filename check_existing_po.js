const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkExistingPO() {
  try {
    console.log('🔍 Verificando se existe pedido PO-000001...');
    
    const { data: existingPO, error: poError } = await supabase
      .from('mm_purchase_order')
      .select('*')
      .eq('mm_order', 'PO-000001');
    
    if (poError) {
      console.log('❌ Erro ao buscar pedido:', poError);
      return;
    }
    
    if (existingPO && existingPO.length > 0) {
      console.log('✅ Pedido PO-000001 existe:', existingPO[0]);
    } else {
      console.log('❌ Pedido PO-000001 não existe');
      
      // Criar um pedido primeiro
      console.log('🚀 Criando pedido PO-000001...');
      const { data: newPO, error: createError } = await supabase
        .from('mm_purchase_order')
        .insert([{
          tenant_id: 'LaplataLunaria',
          mm_order: 'PO-000001',
          vendor_id: 'SUP_00001',
          po_date: '2025-09-22',
          status: 'draft',
          total_amount: 0
        }])
        .select('*');
      
      if (createError) {
        console.log('❌ Erro ao criar pedido:', createError);
      } else {
        console.log('✅ Pedido criado:', newPO[0]);
      }
    }
    
    // Agora tentar inserir o item
    console.log('');
    console.log('🔍 Tentando inserir item no pedido PO-000001...');
    
    const testItem = {
      mm_order: 'PO-000001',
      plant_id: 'DEFAULT',
      mm_material: 'B_176',
      mm_qtt: 1,
      unit_cost_cents: 360000,
      line_total_cents: 360000
    };
    
    const { data: itemData, error: itemError } = await supabase
      .from('mm_purchase_order_item')
      .insert([testItem])
      .select('*');
    
    if (itemError) {
      console.log('❌ Erro ao inserir item:', itemError);
    } else {
      console.log('✅ Item inserido com sucesso:', itemData[0]);
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

checkExistingPO();
