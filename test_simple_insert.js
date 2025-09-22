const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testSimpleInsert() {
  try {
    console.log('🔍 Testando inserção simples sem triggers...');
    
    // Tentar inserir apenas os campos essenciais
    const simpleItem = {
      tenant_id: 'LaplataLunaria',
      mm_order: 'PO-2025-001',
      mm_material: 'B_176',
      mm_qtt: 1
    };
    
    console.log('📝 Item simples:', simpleItem);
    
    const { data, error } = await supabase
      .from('mm_purchase_order_item')
      .insert([simpleItem])
      .select('*');
    
    if (error) {
      console.log('❌ Erro com campos simples:', error);
      
      // Tentar com campos diferentes
      console.log('');
      console.log('🔍 Tentando com campos diferentes...');
      
      const alternativeItem = {
        tenant_id: 'LaplataLunaria',
        mm_order: 'PO-2025-001',
        mm_material: 'B_176',
        quantity: 1  // Usar 'quantity' em vez de 'mm_qtt'
      };
      
      console.log('📝 Item alternativo:', alternativeItem);
      
      const { data: altData, error: altError } = await supabase
        .from('mm_purchase_order_item')
        .insert([alternativeItem])
        .select('*');
      
      if (altError) {
        console.log('❌ Erro com campos alternativos:', altError);
      } else {
        console.log('✅ Sucesso com campos alternativos:', altData[0]);
      }
      
    } else {
      console.log('✅ Sucesso com campos simples:', data[0]);
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

testSimpleInsert();
