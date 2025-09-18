const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://gpjcfwjssfvqhppxdudp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwamNmd2pzc2Z2cWhwcHhkdWRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDQyOTUsImV4cCI6MjA3MzUyMDI5NX0.6h6ogP8aMCvy7fUNN1mbxSK-O0TbGiEIP5rO5z0s0r0';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwamNmd2pzc2Z2cWhwcHhkdWRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk0NDI5NSwiZXhwIjoyMDczNTIwMjk1fQ.QX3vlHLduidBh1HFFklS4P9xkL5xhe9oOnhZ2fcb-_s';

const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

async function inspectSupabaseFull() {
  console.log('🔍 INSPEÇÃO COMPLETA DO SUPABASE - TODOS OS DADOS');
  console.log('================================================');
  console.log(`URL: ${supabaseUrl}`);
  console.log('');

  try {
    // 1. Verificar conexão com chave anônima
    console.log('1️⃣ TESTANDO CONEXÃO ANÔNIMA...');
    const { data: testDataAnon, error: testErrorAnon } = await supabaseAnon
      .from('tenant')
      .select('*')
      .limit(1);
    
    if (testErrorAnon) {
      console.log('❌ Erro de conexão anônima:', testErrorAnon.message);
    } else {
      console.log('✅ Conexão anônima estabelecida!');
    }
    console.log('');

    // 2. Verificar conexão com service role
    console.log('2️⃣ TESTANDO CONEXÃO SERVICE ROLE...');
    const { data: testDataService, error: testErrorService } = await supabaseService
      .from('tenant')
      .select('*')
      .limit(1);
    
    if (testErrorService) {
      console.log('❌ Erro de conexão service role:', testErrorService.message);
    } else {
      console.log('✅ Conexão service role estabelecida!');
    }
    console.log('');

    // 3. Listar TODOS os tenants disponíveis
    console.log('3️⃣ TODOS OS TENANTS DISPONÍVEIS');
    console.log('===============================');
    
    const { data: allTenants, error: tenantsError } = await supabaseService
      .from('tenant')
      .select('*');
    
    if (tenantsError) {
      console.log('❌ Erro ao buscar tenants:', tenantsError.message);
    } else {
      console.log(`✅ Encontrados ${allTenants?.length || 0} tenants:`);
      allTenants?.forEach(tenant => {
        console.log(`  - ${tenant.tenant_id}: ${tenant.display_name || 'Sem nome'}`);
      });
    }
    console.log('');

    // 4. Verificar dados em TODOS os tenants
    console.log('4️⃣ DADOS EM TODOS OS TENANTS');
    console.log('============================');
    
    const tables = [
      'mm_vendor', 'mm_material', 'mm_purchase_order', 'mm_purchase_order_item', 'mm_receiving',
      'wh_warehouse', 'wh_inventory_balance', 'wh_inventory_ledger',
      'crm_customer', 'sd_sales_order', 'sd_sales_order_item', 'sd_shipment', 'sd_payment',
      'crm_lead', 'crm_opportunity', 'crm_interaction',
      'fi_account', 'fi_invoice', 'fi_payment', 'fi_transaction',
      'co_cost_center', 'co_fiscal_period', 'co_kpi_definition', 'co_kpi_snapshot', 'co_dashboard_tile'
    ];

    for (const table of tables) {
      try {
        const { data, error, count } = await supabaseService
          .from(table)
          .select('*', { count: 'exact' })
          .limit(10);
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: ${count} registros`);
          if (data && data.length > 0) {
            console.log(`   Colunas: ${Object.keys(data[0]).join(', ')}`);
            console.log(`   Amostra:`, JSON.stringify(data.slice(0, 3), null, 2));
          }
        }
        console.log('');
      } catch (err) {
        console.log(`❌ ${table}: Erro - ${err.message}`);
        console.log('');
      }
    }

    // 5. Verificar se há dados específicos do LaplataLunaria
    console.log('5️⃣ DADOS ESPECÍFICOS DO TENANT LaplataLunaria');
    console.log('=============================================');

    const { data: laplataVendors } = await supabaseService
      .from('mm_vendor')
      .select('*')
      .eq('tenant_id', 'LaplataLunaria');
    
    console.log(`📦 Fornecedores LaplataLunaria: ${laplataVendors?.length || 0}`);
    if (laplataVendors && laplataVendors.length > 0) {
      console.log(JSON.stringify(laplataVendors, null, 2));
    }
    console.log('');

    const { data: laplataMaterials } = await supabaseService
      .from('mm_material')
      .select('*')
      .eq('tenant_id', 'LaplataLunaria')
      .limit(5);
    
    console.log(`💎 Materiais LaplataLunaria: ${laplataMaterials?.length || 0}`);
    if (laplataMaterials && laplataMaterials.length > 0) {
      console.log(JSON.stringify(laplataMaterials, null, 2));
    }
    console.log('');

    // 6. Verificar se há dados em outros tenants
    console.log('6️⃣ VERIFICANDO OUTROS TENANTS');
    console.log('=============================');
    
    const { data: allVendors } = await supabaseService
      .from('mm_vendor')
      .select('tenant_id, vendor_id, vendor_name')
      .limit(20);
    
    if (allVendors && allVendors.length > 0) {
      console.log('Fornecedores encontrados em todos os tenants:');
      allVendors.forEach(vendor => {
        console.log(`  ${vendor.tenant_id}: ${vendor.vendor_id} - ${vendor.vendor_name}`);
      });
    } else {
      console.log('Nenhum fornecedor encontrado em nenhum tenant.');
    }
    console.log('');

    // 7. Verificar estrutura das tabelas principais
    console.log('7️⃣ ESTRUTURA DAS TABELAS PRINCIPAIS');
    console.log('==================================');
    
    const mainTables = ['mm_vendor', 'mm_material', 'wh_warehouse', 'wh_inventory_balance'];
    
    for (const table of mainTables) {
      try {
        const { data, error } = await supabaseService
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else if (data && data.length > 0) {
          console.log(`✅ ${table}:`);
          console.log(`   Colunas: ${Object.keys(data[0]).join(', ')}`);
        } else {
          console.log(`⚠️  ${table}: Tabela vazia, mas estrutura existe`);
        }
        console.log('');
      } catch (err) {
        console.log(`❌ ${table}: Erro - ${err.message}`);
        console.log('');
      }
    }

    console.log('✅ INSPEÇÃO COMPLETA FINALIZADA!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar inspeção
inspectSupabaseFull();