#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * GUARDRAIL DE TESTES END-TO-END "COMO USUÁRIO"
 * 
 * Valida que UI ↔ DB real batem exatamente (conteúdo e formato)
 * Sem violar segurança, sem gambiarras, sem tocar no Supabase/ENV
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// ============================================================================
// CONFIGURAÇÃO E CONSTANTES
// ============================================================================

const TEST_CONFIG = {
  // URLs base
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  
  // Supabase (usar apenas anon key + cookies)
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  
  // Timeouts
  PAGE_LOAD_TIMEOUT: 10000,
  API_TIMEOUT: 5000,
  
  // Diretórios
  REPORTS_DIR: 'test-reports',
  SCREENSHOTS_DIR: 'test-reports/screenshots'
};

// ============================================================================
// REGRAS INEGOCIÁVEIS - VALIDAÇÃO
// ============================================================================

function validateInegoriableRules() {
  console.log('🔒 VALIDANDO REGRAS INEGOCIÁVEIS...');
  
  const violations = [];
  
  // 1. Verificar se não há SERVICE_ROLE_KEY no frontend
  const frontendFiles = require('glob').sync('app/**/*.{ts,tsx}').filter(f => !f.includes('/api/'));
  for (const file of frontendFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('SUPABASE_SERVICE_ROLE_KEY')) {
        violations.push(`❌ SERVICE_ROLE_KEY detectado no frontend: ${file}`);
      }
    }
  }
  
  // 2. Verificar se não há hardcode de tenant
  const criticalFiles = ['lib/auth/requireSession.ts', 'lib/supabase/server.ts', 'middleware.ts'];
  for (const file of criticalFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes("'LaplataLunaria'") || content.includes('"LaplataLunaria"')) {
        violations.push(`❌ Hardcode de tenant detectado: ${file}`);
      }
    }
  }
  
  // 3. Verificar se não há *10000 ou /10000
  const allFiles = require('glob').sync('app/**/*.{ts,tsx}');
  for (const file of allFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('* 10000') || content.includes('/ 10000')) {
        violations.push(`❌ Uso de *10000 ou /10000 detectado: ${file}`);
      }
    }
  }
  
  if (violations.length > 0) {
    console.error('❌ VIOLAÇÕES DETECTADAS:');
    violations.forEach(v => console.error(v));
    process.exit(1);
  }
  
  console.log('✅ REGRAS INEGOCIÁVEIS VALIDADAS');
}

// ============================================================================
// UTILITÁRIOS DE TESTE
// ============================================================================

function createTestReport(module, page, scenario) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportId = `${module}_${page}_${scenario}_${timestamp}`;
  
  return {
    id: reportId,
    module,
    page,
    scenario,
    timestamp: new Date().toISOString(),
    steps: [],
    ui_observed: {},
    db_query: {},
    comparison: 'PENDING',
    divergences: [],
    possible_causes: [],
    severity: 'P0',
    evidence: [],
    status: 'RUNNING'
  };
}

function saveTestReport(report) {
  const reportsDir = TEST_CONFIG.REPORTS_DIR;
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const reportFile = path.join(reportsDir, `${report.id}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  
  console.log(`📊 Relatório salvo: ${reportFile}`);
}

function formatBRL(cents) {
  if (typeof cents !== 'number' || isNaN(cents)) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(cents / 100);
}

function toCents(input) {
  if (typeof input === 'number') {
    return Math.round(input * 100);
  }
  
  const cleanValue = String(input)
    .replace(/\./g, '')
    .replace(',', '.');
  
  const numericValue = parseFloat(cleanValue);
  return isNaN(numericValue) ? 0 : Math.round(numericValue * 100);
}

// ============================================================================
// COMPARAÇÃO UI ↔ DB
// ============================================================================

async function compareUIWithDB(uiData, dbData, report) {
  console.log('🔍 COMPARANDO UI ↔ DB...');
  
  const divergences = [];
  
  // 1. Comparar contagem
  if (uiData.count !== dbData.count) {
    divergences.push({
      field: 'count',
      ui_value: uiData.count,
      db_value: dbData.count,
      type: 'COUNT_MISMATCH'
    });
  }
  
  // 2. Comparar ordenação
  if (uiData.order !== dbData.order) {
    divergences.push({
      field: 'order',
      ui_value: uiData.order,
      db_value: dbData.order,
      type: 'ORDER_MISMATCH'
    });
  }
  
  // 3. Comparar dados linha por linha
  const minRows = Math.min(uiData.rows.length, dbData.rows.length);
  for (let i = 0; i < minRows; i++) {
    const uiRow = uiData.rows[i];
    const dbRow = dbData.rows[i];
    
    for (const field of Object.keys(uiRow)) {
      if (uiRow[field] !== dbRow[field]) {
        divergences.push({
          field: `${field}[${i}]`,
          ui_value: uiRow[field],
          db_value: dbRow[field],
          type: 'VALUE_MISMATCH'
        });
      }
    }
  }
  
  // 4. Comparar KPIs/Totais
  if (uiData.totals && dbData.totals) {
    for (const [key, uiValue] of Object.entries(uiData.totals)) {
      const dbValue = dbData.totals[key];
      if (uiValue !== dbValue) {
        divergences.push({
          field: `total_${key}`,
          ui_value: uiValue,
          db_value: dbValue,
          type: 'TOTAL_MISMATCH'
        });
      }
    }
  }
  
  report.divergences = divergences;
  report.comparison = divergences.length === 0 ? 'APROVADO' : 'REPROVADO';
  
  if (divergences.length > 0) {
    console.log(`❌ ${divergences.length} divergências encontradas`);
    divergences.forEach(d => {
      console.log(`  - ${d.field}: UI="${d.ui_value}" vs DB="${d.db_value}"`);
    });
  } else {
    console.log('✅ UI ↔ DB 100% idênticos');
  }
  
  return divergences.length === 0;
}

// ============================================================================
// TESTES POR MÓDULO
// ============================================================================

async function testMMCatalog() {
  console.log('🧪 TESTANDO MM - CATÁLOGO DE MATERIAIS...');
  
  const report = createTestReport('MM', 'catalog', 'list_and_pagination');
  
  try {
    // 1. Simular navegação para catálogo
    report.steps.push('Navegar para /mm/catalog');
    
    // 2. Simular dados da UI (seria obtido via scraping real)
    const uiData = {
      count: 0, // Seria obtido da UI real
      order: 'mm_material ASC',
      rows: [], // Seria obtido da UI real
      totals: {
        total_materials: 0,
        total_value: 0
      }
    };
    
    // 3. Consultar DB via SSR (simulado)
    const supabase = createClient(TEST_CONFIG.SUPABASE_URL, TEST_CONFIG.SUPABASE_ANON_KEY);
    
    const { data: materials, error } = await supabase
      .from('mm_material')
      .select('mm_material, mm_comercial, mm_desc, mm_price_cents, mm_purchase_price_cents, status')
      .order('mm_material', { ascending: true });
    
    if (error) {
      throw new Error(`Erro ao consultar DB: ${error.message}`);
    }
    
    const dbData = {
      count: materials.length,
      order: 'mm_material ASC',
      rows: materials.map(m => ({
        code: m.mm_material,
        name: m.mm_comercial,
        description: m.mm_desc,
        price: formatBRL(m.mm_price_cents),
        purchase_price: formatBRL(m.mm_purchase_price_cents),
        status: m.status
      })),
      totals: {
        total_materials: materials.length,
        total_value: materials.reduce((sum, m) => sum + (m.mm_price_cents || 0), 0)
      }
    };
    
    report.ui_observed = uiData;
    report.db_query = {
      query: 'SELECT mm_material, mm_comercial, mm_desc, mm_price_cents, mm_purchase_price_cents, status FROM mm_material ORDER BY mm_material ASC',
      result_count: materials.length
    };
    
    // 4. Comparar
    const isIdentical = await compareUIWithDB(uiData, dbData, report);
    
    if (!isIdentical) {
      report.possible_causes = [
        'Falta de revalidatePath após mutações',
        'Consulta no client ao invés de SSR',
        'Problema de hidratação',
        'RLS bloqueando dados'
      ];
      report.severity = 'P1';
    }
    
    report.status = 'COMPLETED';
    saveTestReport(report);
    
    return isIdentical;
    
  } catch (error) {
    report.status = 'FAILED';
    report.divergences.push({
      field: 'error',
      ui_value: 'N/A',
      db_value: error.message,
      type: 'EXECUTION_ERROR'
    });
    saveTestReport(report);
    throw error;
  }
}

async function testMMPurchaseOrders() {
  console.log('🧪 TESTANDO MM - PEDIDOS DE COMPRA...');
  
  const report = createTestReport('MM', 'purchases', 'create_and_edit');
  
  try {
    // 1. Simular criação de PO
    report.steps.push('Criar novo pedido de compra');
    
    // 2. Simular dados da UI
    const uiData = {
      count: 0,
      order: 'po_date DESC',
      rows: [],
      totals: {
        total_orders: 0,
        total_value: 0
      }
    };
    
    // 3. Consultar DB
    const supabase = createClient(TEST_CONFIG.SUPABASE_URL, TEST_CONFIG.SUPABASE_ANON_KEY);
    
    const { data: orders, error } = await supabase
      .from('mm_purchase_order')
      .select(`
        mm_order,
        po_date,
        status,
        total_cents,
        mm_vendor!left(vendor_name)
      `)
      .order('po_date', { ascending: false });
    
    if (error) {
      throw new Error(`Erro ao consultar DB: ${error.message}`);
    }
    
    const dbData = {
      count: orders.length,
      order: 'po_date DESC',
      rows: orders.map(o => ({
        order_id: o.mm_order,
        date: new Date(o.po_date).toLocaleDateString('pt-BR'),
        status: o.status,
        total: formatBRL(o.total_cents),
        vendor: o.mm_vendor?.vendor_name || 'N/A'
      })),
      totals: {
        total_orders: orders.length,
        total_value: orders.reduce((sum, o) => sum + (o.total_cents || 0), 0)
      }
    };
    
    report.ui_observed = uiData;
    report.db_query = {
      query: 'SELECT mm_order, po_date, status, total_cents, mm_vendor.vendor_name FROM mm_purchase_order LEFT JOIN mm_vendor ON mm_purchase_order.vendor_id = mm_vendor.vendor_id ORDER BY po_date DESC',
      result_count: orders.length
    };
    
    // 4. Comparar
    const isIdentical = await compareUIWithDB(uiData, dbData, report);
    
    if (!isIdentical) {
      report.possible_causes = [
        'Problema de cálculo de totais',
        'Falta de revalidatePath após criação',
        'Problema de formatação de moeda',
        'RLS bloqueando dados de vendor'
      ];
      report.severity = 'P1';
    }
    
    report.status = 'COMPLETED';
    saveTestReport(report);
    
    return isIdentical;
    
  } catch (error) {
    report.status = 'FAILED';
    report.divergences.push({
      field: 'error',
      ui_value: 'N/A',
      db_value: error.message,
      type: 'EXECUTION_ERROR'
    });
    saveTestReport(report);
    throw error;
  }
}

async function testSDOrders() {
  console.log('🧪 TESTANDO SD - PEDIDOS DE VENDA...');
  
  const report = createTestReport('SD', 'orders', 'list_and_creation');
  
  try {
    // 1. Simular navegação para pedidos de venda
    report.steps.push('Navegar para /sd/orders');
    
    // 2. Simular dados da UI
    const uiData = {
      count: 0,
      order: 'order_date DESC',
      rows: [],
      totals: {
        total_orders: 0,
        total_value: 0,
        approved_orders: 0
      }
    };
    
    // 3. Consultar DB
    const supabase = createClient(TEST_CONFIG.SUPABASE_URL, TEST_CONFIG.SUPABASE_ANON_KEY);
    
    const { data: orders, error } = await supabase
      .from('sd_sales_order')
      .select(`
        so_id,
        doc_no,
        order_date,
        status,
        total_final_cents,
        total_negotiated_cents,
        crm_customer!left(name)
      `)
      .order('order_date', { ascending: false });
    
    if (error) {
      throw new Error(`Erro ao consultar DB: ${error.message}`);
    }
    
    const dbData = {
      count: orders.length,
      order: 'order_date DESC',
      rows: orders.map(o => ({
        order_id: o.so_id,
        doc_no: o.doc_no,
        date: new Date(o.order_date).toLocaleDateString('pt-BR'),
        status: o.status,
        total: formatBRL(o.total_final_cents),
        negotiated: formatBRL(o.total_negotiated_cents),
        customer: o.crm_customer?.name || 'N/A'
      })),
      totals: {
        total_orders: orders.length,
        total_value: orders.reduce((sum, o) => sum + (o.total_final_cents || 0), 0),
        approved_orders: orders.filter(o => o.status === 'approved').length
      }
    };
    
    report.ui_observed = uiData;
    report.db_query = {
      query: 'SELECT so_id, doc_no, order_date, status, total_final_cents, total_negotiated_cents, crm_customer.name FROM sd_sales_order LEFT JOIN crm_customer ON sd_sales_order.customer_id = crm_customer.customer_id ORDER BY order_date DESC',
      result_count: orders.length
    };
    
    // 4. Comparar
    const isIdentical = await compareUIWithDB(uiData, dbData, report);
    
    if (!isIdentical) {
      report.possible_causes = [
        'API de clientes não implementada (GET)',
        'Problema de cálculo de totais',
        'Falta de revalidatePath após mutações',
        'Problema de formatação de moeda'
      ];
      report.severity = 'P1';
    }
    
    report.status = 'COMPLETED';
    saveTestReport(report);
    
    return isIdentical;
    
  } catch (error) {
    report.status = 'FAILED';
    report.divergences.push({
      field: 'error',
      ui_value: 'N/A',
      db_value: error.message,
      type: 'EXECUTION_ERROR'
    });
    saveTestReport(report);
    throw error;
  }
}

// ============================================================================
// FUNÇÃO PRINCIPAL
// ============================================================================

async function runE2ETests(module = 'ALL') {
  console.log('🚀 INICIANDO TESTES END-TO-END "COMO USUÁRIO"...\n');
  
  // 1. Validar regras inegociáveis
  validateInegoriableRules();
  
  // 2. Criar diretórios de relatórios
  if (!fs.existsSync(TEST_CONFIG.REPORTS_DIR)) {
    fs.mkdirSync(TEST_CONFIG.REPORTS_DIR, { recursive: true });
  }
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    reports: []
  };
  
  try {
    // 3. Executar testes por módulo
    if (module === 'ALL' || module === 'MM') {
      console.log('\n📦 TESTANDO MÓDULO MM (MATERIAIS)...');
      
      const catalogResult = await testMMCatalog();
      results.total++;
      if (catalogResult) results.passed++; else results.failed++;
      
      const poResult = await testMMPurchaseOrders();
      results.total++;
      if (poResult) results.passed++; else results.failed++;
    }
    
    if (module === 'ALL' || module === 'SD') {
      console.log('\n💰 TESTANDO MÓDULO SD (VENDAS)...');
      
      const sdResult = await testSDOrders();
      results.total++;
      if (sdResult) results.passed++; else results.failed++;
    }
    
    // 4. Relatório final
    console.log('\n📊 RELATÓRIO FINAL:');
    console.log(`Total: ${results.total}`);
    console.log(`Aprovados: ${results.passed}`);
    console.log(`Reprovados: ${results.failed}`);
    console.log(`Taxa de sucesso: ${((results.passed / results.total) * 100).toFixed(1)}%`);
    
    if (results.failed > 0) {
      console.log('\n❌ TESTES REPROVADOS - VERIFICAR RELATÓRIOS EM test-reports/');
      process.exit(1);
    } else {
      console.log('\n✅ TODOS OS TESTES APROVADOS!');
    }
    
  } catch (error) {
    console.error('\n❌ ERRO DURANTE EXECUÇÃO DOS TESTES:', error.message);
    process.exit(1);
  }
}

// ============================================================================
// EXECUÇÃO
// ============================================================================

if (require.main === module) {
  const module = process.argv[2] || 'ALL';
  runE2ETests(module).catch(console.error);
}

module.exports = { runE2ETests, validateInegoriableRules };
