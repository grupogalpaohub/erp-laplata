const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://gpjcfwjssfvqhppxdudp.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwamNmd2pzc2Z2cWhwcHhkdWRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk0NDI5NSwiZXhwIjoyMDczNTIwMjk1fQ.QX3vlHLduidBh1HFFklS4P9xkL5xhe9oOnhZ2fcb-_s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function exportAllSupabaseData() {
  console.log('📊 EXPORTANDO TODOS OS DADOS DO SUPABASE');
  console.log('========================================');

  const allData = {
    metadata: {
      export_date: new Date().toISOString(),
      supabase_url: supabaseUrl,
      project_id: 'gpjcfwjssfvqhppxdudp',
      tenant: 'LaplataLunaria'
    },
    tables: {}
  };

  // Lista de todas as tabelas para verificar
  const tables = [
    'tenant', 'user_profile', 'role_permission', 'app_setting', 'doc_numbering', 'audit_log',
    'mm_vendor', 'mm_material', 'mm_purchase_order', 'mm_purchase_order_item', 'mm_receiving',
    'wh_warehouse', 'wh_inventory_balance', 'wh_inventory_ledger',
    'crm_customer', 'sd_sales_order', 'sd_sales_order_item', 'sd_shipment', 'sd_payment',
    'crm_lead', 'crm_opportunity', 'crm_interaction',
    'fi_account', 'fi_invoice', 'fi_payment', 'fi_transaction',
    'co_cost_center', 'co_fiscal_period', 'co_kpi_definition', 'co_kpi_snapshot', 'co_dashboard_tile',
    'mm_setup', 'mm_category_def', 'mm_classification_def', 'mm_price_channel_def', 'mm_currency_def', 
    'mm_vendor_rating_def', 'mm_status_def',
    'wh_setup', 'wh_inventory_status_def',
    'sd_setup', 'sd_order_status_def', 'sd_shipment_status_def', 'sd_carrier_def', 'sd_channel_def',
    'crm_setup', 'crm_source_def', 'crm_lead_status_def', 'crm_opp_stage_def',
    'fi_setup', 'fi_payment_method_def', 'fi_payment_terms_def', 'fi_tax_code_def',
    'co_setup',
    'import_job', 'import_log'
  ];

  let totalRecords = 0;
  let tablesWithData = 0;
  let emptyTables = 0;

  for (const table of tables) {
    try {
      console.log(`📋 Verificando tabela: ${table}...`);
      
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' });

      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
        allData.tables[table] = {
          error: error.message,
          count: 0,
          data: []
        };
        emptyTables++;
      } else {
        const recordCount = count || 0;
        totalRecords += recordCount;
        
        if (recordCount > 0) {
          tablesWithData++;
          console.log(`✅ ${table}: ${recordCount} registros`);
        } else {
          emptyTables++;
          console.log(`⚠️  ${table}: 0 registros`);
        }

        allData.tables[table] = {
          count: recordCount,
          data: data || [],
          columns: data && data.length > 0 ? Object.keys(data[0]) : []
        };
      }
    } catch (err) {
      console.log(`❌ ${table}: Erro - ${err.message}`);
      allData.tables[table] = {
        error: err.message,
        count: 0,
        data: []
      };
      emptyTables++;
    }
  }

  // Estatísticas finais
  allData.metadata.statistics = {
    total_tables: tables.length,
    tables_with_data: tablesWithData,
    empty_tables: emptyTables,
    total_records: totalRecords
  };

  // Salvar dados completos
  console.log('\n💾 Salvando dados completos...');
  fs.writeFileSync('/workspace/SUPABASE_COMPLETE_DATA.json', JSON.stringify(allData, null, 2));

  // Gerar relatório resumido
  console.log('📊 Gerando relatório resumido...');
  const summaryReport = generateSummaryReport(allData);
  fs.writeFileSync('/workspace/SUPABASE_SUMMARY_REPORT.md', summaryReport);

  // Gerar dados estruturados por módulo
  console.log('🏗️ Gerando dados por módulo...');
  const moduleData = generateModuleData(allData);
  fs.writeFileSync('/workspace/SUPABASE_MODULE_DATA.json', JSON.stringify(moduleData, null, 2));

  console.log('\n✅ EXPORTAÇÃO COMPLETA FINALIZADA!');
  console.log('📁 Arquivos gerados:');
  console.log('   - SUPABASE_COMPLETE_DATA.json (dados completos)');
  console.log('   - SUPABASE_SUMMARY_REPORT.md (relatório resumido)');
  console.log('   - SUPABASE_MODULE_DATA.json (dados por módulo)');
  console.log(`\n📊 Estatísticas:`);
  console.log(`   - Total de tabelas: ${tables.length}`);
  console.log(`   - Tabelas com dados: ${tablesWithData}`);
  console.log(`   - Tabelas vazias: ${emptyTables}`);
  console.log(`   - Total de registros: ${totalRecords}`);
}

function generateSummaryReport(data) {
  const { metadata, tables } = data;
  
  let report = `# 📊 Relatório Resumido do Supabase - ERP Laplata

**Data da Exportação**: ${new Date(metadata.export_date).toLocaleString('pt-BR')}  
**Projeto**: ${metadata.project_id}  
**URL**: ${metadata.supabase_url}  
**Tenant**: ${metadata.tenant}  

## 📈 Resumo Executivo

- **Total de Tabelas**: ${metadata.statistics.total_tables}
- **Tabelas com Dados**: ${metadata.statistics.tables_with_data}
- **Tabelas Vazias**: ${metadata.statistics.empty_tables}
- **Total de Registros**: ${metadata.statistics.total_records}

## 📋 Status das Tabelas

### ✅ Tabelas com Dados
`;

  // Listar tabelas com dados
  Object.entries(tables).forEach(([tableName, tableData]) => {
    if (tableData.count > 0) {
      report += `- **${tableName}**: ${tableData.count} registros\n`;
    }
  });

  report += `\n### ⚠️ Tabelas Vazias\n`;

  // Listar tabelas vazias
  Object.entries(tables).forEach(([tableName, tableData]) => {
    if (tableData.count === 0 && !tableData.error) {
      report += `- **${tableName}**: 0 registros\n`;
    }
  });

  report += `\n### ❌ Tabelas com Erro\n`;

  // Listar tabelas com erro
  Object.entries(tables).forEach(([tableName, tableData]) => {
    if (tableData.error) {
      report += `- **${tableName}**: ${tableData.error}\n`;
    }
  });

  // Dados por módulo
  report += `\n## 🏗️ Dados por Módulo\n\n`;

  const modules = {
    'MM - Materiais': ['mm_vendor', 'mm_material', 'mm_purchase_order', 'mm_purchase_order_item', 'mm_receiving'],
    'WH - Depósitos': ['wh_warehouse', 'wh_inventory_balance', 'wh_inventory_ledger'],
    'SD - Vendas': ['crm_customer', 'sd_sales_order', 'sd_sales_order_item', 'sd_shipment', 'sd_payment'],
    'CRM - Relacionamento': ['crm_lead', 'crm_opportunity', 'crm_interaction'],
    'FI - Financeiro': ['fi_account', 'fi_invoice', 'fi_payment', 'fi_transaction'],
    'CO - Controladoria': ['co_cost_center', 'co_fiscal_period', 'co_kpi_definition', 'co_kpi_snapshot', 'co_dashboard_tile']
  };

  Object.entries(modules).forEach(([moduleName, moduleTables]) => {
    report += `### ${moduleName}\n`;
    moduleTables.forEach(tableName => {
      const tableData = tables[tableName];
      if (tableData) {
        const status = tableData.error ? '❌' : (tableData.count > 0 ? '✅' : '⚠️');
        report += `- ${status} **${tableName}**: ${tableData.count} registros\n`;
      }
    });
    report += '\n';
  });

  report += `\n---
*Relatório gerado automaticamente pelo sistema de exportação do Supabase*`;

  return report;
}

function generateModuleData(data) {
  const { tables } = data;
  
  return {
    metadata: data.metadata,
    modules: {
      mm: {
        name: 'Material Management',
        tables: {
          vendor: tables.mm_vendor,
          material: tables.mm_material,
          purchase_order: tables.mm_purchase_order,
          purchase_order_item: tables.mm_purchase_order_item,
          receiving: tables.mm_receiving
        }
      },
      wh: {
        name: 'Warehouse Management',
        tables: {
          warehouse: tables.wh_warehouse,
          inventory_balance: tables.wh_inventory_balance,
          inventory_ledger: tables.wh_inventory_ledger
        }
      },
      sd: {
        name: 'Sales & Distribution',
        tables: {
          customer: tables.crm_customer,
          sales_order: tables.sd_sales_order,
          sales_order_item: tables.sd_sales_order_item,
          shipment: tables.sd_shipment,
          payment: tables.sd_payment
        }
      },
      crm: {
        name: 'Customer Relationship Management',
        tables: {
          lead: tables.crm_lead,
          opportunity: tables.crm_opportunity,
          interaction: tables.crm_interaction
        }
      },
      fi: {
        name: 'Financial Management',
        tables: {
          account: tables.fi_account,
          invoice: tables.fi_invoice,
          payment: tables.fi_payment,
          transaction: tables.fi_transaction
        }
      },
      co: {
        name: 'Controlling',
        tables: {
          cost_center: tables.co_cost_center,
          fiscal_period: tables.co_fiscal_period,
          kpi_definition: tables.co_kpi_definition,
          kpi_snapshot: tables.co_kpi_snapshot,
          dashboard_tile: tables.co_dashboard_tile
        }
      }
    }
  };
}

// Executar exportação
exportAllSupabaseData();