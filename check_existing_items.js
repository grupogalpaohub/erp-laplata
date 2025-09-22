const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkExistingItems() {
  try {
    console.log('🔍 Verificando itens existentes na tabela mm_purchase_order_item...');
    
    const { data: existingItems, error: itemsError } = await supabase
      .from('mm_purchase_order_item')
      .select('*')
      .limit(5);
    
    if (itemsError) {
      console.log('❌ Erro ao buscar itens existentes:', itemsError);
      return;
    }
    
    if (existingItems && existingItems.length > 0) {
      console.log('✅ Itens existentes encontrados:');
      existingItems.forEach((item, index) => {
        console.log(`   ${index + 1}.`, item);
      });
    } else {
      console.log('❌ Nenhum item encontrado na tabela');
    }
    
    // Verificar estrutura da tabela tentando buscar todos os campos
    console.log('');
    console.log('🔍 Verificando estrutura da tabela...');
    
    const { data: allItems, error: allError } = await supabase
      .from('mm_purchase_order_item')
      .select('*')
      .limit(1);
    
    if (allError) {
      console.log('❌ Erro ao verificar estrutura:', allError);
    } else {
      console.log('✅ Estrutura da tabela (primeiro item):');
      if (allItems && allItems.length > 0) {
        Object.keys(allItems[0]).forEach(key => {
          console.log(`   - ${key}: ${typeof allItems[0][key]}`);
        });
      }
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

checkExistingItems();
