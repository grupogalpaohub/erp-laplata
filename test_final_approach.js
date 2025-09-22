const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testFinalApproach() {
  try {
    console.log('🔍 Testando abordagem final - inserção mínima...');
    
    // Tentar inserir apenas os campos mais básicos possíveis
    const minimalItem = {
      tenant_id: 'LaplataLunaria',
      mm_order: 'PO-2025-001',
      mm_material: 'B_176',
      mm_qtt: 1
    };
    
    console.log('📝 Item mínimo:', minimalItem);
    
    const { data, error } = await supabase
      .from('mm_purchase_order_item')
      .insert([minimalItem])
      .select('*');
    
    if (error) {
      console.log('❌ Erro com item mínimo:', error);
      
      // Se ainda der erro, vamos tentar uma abordagem diferente
      console.log('');
      console.log('🔍 Tentando abordagem alternativa - verificar se o problema é com o trigger...');
      
      // Verificar se há algum problema com o tenant_id
      const noTenantItem = {
        mm_order: 'PO-2025-001',
        mm_material: 'B_176',
        mm_qtt: 1
      };
      
      console.log('📝 Item sem tenant_id:', noTenantItem);
      
      const { data: noTenantData, error: noTenantError } = await supabase
        .from('mm_purchase_order_item')
        .insert([noTenantItem])
        .select('*');
      
      if (noTenantError) {
        console.log('❌ Erro sem tenant_id:', noTenantError);
        
        // Última tentativa - usar exatamente a mesma estrutura dos dados existentes
        console.log('');
        console.log('🔍 Última tentativa - usar estrutura exata dos dados existentes...');
        
        const exactItem = {
          tenant_id: 'LaplataLunaria',
          po_item_id: 999,  // Usar um ID alto para evitar conflitos
          mm_order: 'PO-2025-001',
          plant_id: 'WH-001',
          mm_material: 'B_176',
          mm_qtt: 1,
          unit_cost_cents: 360000,
          line_total_cents: 360000,
          notes: null,
          currency: 'BRL'
        };
        
        console.log('📝 Item exato:', exactItem);
        
        const { data: exactData, error: exactError } = await supabase
          .from('mm_purchase_order_item')
          .insert([exactItem])
          .select('*');
        
        if (exactError) {
          console.log('❌ Erro com item exato:', exactError);
        } else {
          console.log('✅ Sucesso com item exato:', exactData[0]);
        }
        
      } else {
        console.log('✅ Sucesso sem tenant_id:', noTenantData[0]);
      }
      
    } else {
      console.log('✅ Sucesso com item mínimo:', data[0]);
    }
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

testFinalApproach();
