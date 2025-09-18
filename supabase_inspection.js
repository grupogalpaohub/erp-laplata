const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://gpjcfwjssfvqhppxdudp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwamNmd2pzc2Z2cWhwcHhkdWRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDQyOTUsImV4cCI6MjA3MzUyMDI5NX0.6h6ogP8aMCvy7fUNN1mbxSK-O0TbGiEIP5rO5z0s0r0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectSupabase() {
  console.log('🔍 INICIANDO INSPEÇÃO COMPLETA DO SUPABASE');
  console.log('==========================================');
  console.log(`URL: ${supabaseUrl}`);
  console.log(`Tenant: LaplataLunaria`);
  console.log('');

  try {
    // 1. Verificar conexão
    console.log('1️⃣ TESTANDO CONEXÃO...');
    const { data: testData, error: testError } = await supabase
      .from('tenant')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.log('❌ Erro de conexão:', testError.message);
      return;
    }
    console.log('✅ Conexão estabelecida com sucesso!');
    console.log('');

    // 2. Listar todas as tabelas e suas estruturas
    console.log('2️⃣ ESTRUTURA DAS TABELAS');
    console.log('========================');
    
    const tables = [
      'tenant', 'user_profile', 'role_permission', 'app_setting', 'doc_numbering', 'audit_log',
      'mm_vendor', 'mm_material', 'mm_purchase_order', 'mm_purchase_order_item', 'mm_receiving',
      'wh_warehouse', 'wh_inventory_balance', 'wh_inventory_ledger',
      'crm_customer', 'sd_sales_order', 'sd_sales_order_item', 'sd_shipment', 'sd_payment',
      'crm_lead', 'crm_opportunity', 'crm_interaction',
      'fi_account', 'fi_invoice', 'fi_payment', 'fi_transaction',
      'co_cost_center', 'co_fiscal_period', 'co_kpi_definition', 'co_kpi_snapshot', 'co_dashboard_tile',
      'mm_setup', 'mm_category_def', 'mm_classification_def', 'mm_price_channel_def', 'mm_currency_def', 'mm_vendor_rating_def', 'mm_status_def',
      'wh_setup', 'wh_inventory_status_def',
      'sd_setup', 'sd_order_status_def', 'sd_shipment_status_def', 'sd_carrier_def', 'sd_channel_def',
      'crm_setup', 'crm_source_def', 'crm_lead_status_def', 'crm_opp_stage_def',
      'fi_setup', 'fi_payment_method_def', 'fi_payment_terms_def', 'fi_tax_code_def',
      'co_setup',
      'import_job', 'import_log'
    ];

    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .limit(5);
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: ${count} registros`);
          if (data && data.length > 0) {
            console.log(`   Colunas: ${Object.keys(data[0]).join(', ')}`);
            if (data.length <= 3) {
              console.log(`   Dados:`, JSON.stringify(data, null, 2));
            } else {
              console.log(`   Amostra (3 primeiros):`, JSON.stringify(data.slice(0, 3), null, 2));
            }
          }
        }
        console.log('');
      } catch (err) {
        console.log(`❌ ${table}: Erro - ${err.message}`);
        console.log('');
      }
    }

    // 3. Dados específicos do tenant LaplataLunaria
    console.log('3️⃣ DADOS DO TENANT LaplataLunaria');
    console.log('==================================');

    // Fornecedores
    console.log('📦 FORNECEDORES:');
    const { data: vendors } = await supabase
      .from('mm_vendor')
      .select('*')
      .eq('tenant_id', 'LaplataLunaria');
    console.log(JSON.stringify(vendors, null, 2));
    console.log('');

    // Depósitos
    console.log('🏭 DEPÓSITOS:');
    const { data: warehouses } = await supabase
      .from('wh_warehouse')
      .select('*')
      .eq('tenant_id', 'LaplataLunaria');
    console.log(JSON.stringify(warehouses, null, 2));
    console.log('');

    // Materiais (primeiros 10)
    console.log('💎 MATERIAIS (primeiros 10):');
    const { data: materials } = await supabase
      .from('mm_material')
      .select('*')
      .eq('tenant_id', 'LaplataLunaria')
      .limit(10);
    console.log(JSON.stringify(materials, null, 2));
    console.log('');

    // Pedidos de Compra
    console.log('📋 PEDIDOS DE COMPRA:');
    const { data: purchaseOrders } = await supabase
      .from('mm_purchase_order')
      .select('*')
      .eq('tenant_id', 'LaplataLunaria');
    console.log(JSON.stringify(purchaseOrders, null, 2));
    console.log('');

    // Itens de Pedidos de Compra (primeiros 10)
    console.log('📦 ITENS DE PEDIDOS DE COMPRA (primeiros 10):');
    const { data: poItems } = await supabase
      .from('mm_purchase_order_item')
      .select('*')
      .eq('tenant_id', 'LaplataLunaria')
      .limit(10);
    console.log(JSON.stringify(poItems, null, 2));
    console.log('');

    // Recebimentos (primeiros 10)
    console.log('📥 RECEBIMENTOS (primeiros 10):');
    const { data: receivings } = await supabase
      .from('mm_receiving')
      .select('*')
      .eq('tenant_id', 'LaplataLunaria')
      .limit(10);
    console.log(JSON.stringify(receivings, null, 2));
    console.log('');

    // Saldos de Estoque (primeiros 10)
    console.log('📊 SALDOS DE ESTOQUE (primeiros 10):');
    const { data: inventory } = await supabase
      .from('wh_inventory_balance')
      .select('*')
      .eq('tenant_id', 'LaplataLunaria')
      .limit(10);
    console.log(JSON.stringify(inventory, null, 2));
    console.log('');

    // 4. Estatísticas gerais
    console.log('4️⃣ ESTATÍSTICAS GERAIS');
    console.log('======================');
    
    const stats = {};
    for (const table of ['mm_vendor', 'mm_material', 'mm_purchase_order', 'mm_purchase_order_item', 'mm_receiving', 'wh_warehouse', 'wh_inventory_balance']) {
      try {
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', 'LaplataLunaria');
        stats[table] = count || 0;
      } catch (err) {
        stats[table] = 'Erro';
      }
    }
    
    console.log('Contagem de registros por tabela:');
    Object.entries(stats).forEach(([table, count]) => {
      console.log(`  ${table}: ${count}`);
    });

    console.log('');
    console.log('✅ INSPEÇÃO COMPLETA FINALIZADA!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar inspeção
inspectSupabase();