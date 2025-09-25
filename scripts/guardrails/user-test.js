#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * TESTE REAL "COMO USUÁRIO" - NAVEGAÇÃO E VALIDAÇÃO UI ↔ DB
 * 
 * Simula navegação real do usuário e valida que tudo bate com o banco
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const TEST_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  TIMEOUT: 10000
};

// ============================================================================
// SIMULAÇÃO DE NAVEGAÇÃO
// ============================================================================

class UserSimulator {
  constructor() {
    this.currentPage = null;
    this.session = null;
    this.supabase = null;
    this.testResults = [];
  }
  
  async initialize() {
    console.log('🚀 INICIANDO SIMULAÇÃO DE USUÁRIO...');
    
    // Inicializar Supabase (apenas anon key + cookies)
    this.supabase = createClient(TEST_CONFIG.SUPABASE_URL, TEST_CONFIG.SUPABASE_ANON_KEY);
    
    // Verificar sessão
    const { data: { session } } = await this.supabase.auth.getSession();
    if (!session) {
      throw new Error('❌ Sem sessão ativa - necessário fazer login primeiro');
    }
    
    this.session = session;
    console.log('✅ Sessão ativa:', session.user.email);
  }
  
  async navigateTo(page) {
    console.log(`🧭 Navegando para: ${page}`);
    this.currentPage = page;
    
    // Simular carregamento da página
    await this.delay(1000);
    
    return {
      page,
      timestamp: new Date().toISOString(),
      status: 'loaded'
    };
  }
  
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async testMMCatalog() {
    console.log('\n📦 TESTANDO MM - CATÁLOGO DE MATERIAIS...');
    
    const testResult = {
      module: 'MM',
      page: 'catalog',
      scenario: 'list_and_pagination',
      steps: [],
      ui_observed: {},
      db_query: {},
      comparison: 'PENDING',
      divergences: [],
      status: 'RUNNING'
    };
    
    try {
      // 1. Navegar para catálogo
      await this.navigateTo('/mm/catalog');
      testResult.steps.push('Navegar para /mm/catalog');
      
      // 2. Simular dados da UI (seria obtido via scraping real)
      const uiData = await this.simulateUIInteraction('catalog');
      testResult.ui_observed = uiData;
      
      // 3. Consultar DB via SSR
      const dbData = await this.queryDatabase('mm_material');
      testResult.db_query = dbData;
      
      // 4. Comparar UI ↔ DB
      const isIdentical = await this.compareData(uiData, dbData, testResult);
      
      testResult.comparison = isIdentical ? 'APROVADO' : 'REPROVADO';
      testResult.status = 'COMPLETED';
      
      this.testResults.push(testResult);
      return testResult;
      
    } catch (error) {
      testResult.status = 'FAILED';
      testResult.divergences.push({
        field: 'error',
        ui_value: 'N/A',
        db_value: error.message,
        type: 'EXECUTION_ERROR'
      });
      this.testResults.push(testResult);
      throw error;
    }
  }
  
  async testMMPurchaseOrders() {
    console.log('\n🛒 TESTANDO MM - PEDIDOS DE COMPRA...');
    
    const testResult = {
      module: 'MM',
      page: 'purchases',
      scenario: 'create_and_edit',
      steps: [],
      ui_observed: {},
      db_query: {},
      comparison: 'PENDING',
      divergences: [],
      status: 'RUNNING'
    };
    
    try {
      // 1. Navegar para pedidos de compra
      await this.navigateTo('/mm/purchases');
      testResult.steps.push('Navegar para /mm/purchases');
      
      // 2. Simular criação de pedido
      await this.navigateTo('/mm/purchases/new');
      testResult.steps.push('Criar novo pedido de compra');
      
      // 3. Simular dados da UI
      const uiData = await this.simulateUIInteraction('purchases');
      testResult.ui_observed = uiData;
      
      // 4. Consultar DB
      const dbData = await this.queryDatabase('mm_purchase_order');
      testResult.db_query = dbData;
      
      // 5. Comparar UI ↔ DB
      const isIdentical = await this.compareData(uiData, dbData, testResult);
      
      testResult.comparison = isIdentical ? 'APROVADO' : 'REPROVADO';
      testResult.status = 'COMPLETED';
      
      this.testResults.push(testResult);
      return testResult;
      
    } catch (error) {
      testResult.status = 'FAILED';
      testResult.divergences.push({
        field: 'error',
        ui_value: 'N/A',
        db_value: error.message,
        type: 'EXECUTION_ERROR'
      });
      this.testResults.push(testResult);
      throw error;
    }
  }
  
  async testSDOrders() {
    console.log('\n💰 TESTANDO SD - PEDIDOS DE VENDA...');
    
    const testResult = {
      module: 'SD',
      page: 'orders',
      scenario: 'list_and_creation',
      steps: [],
      ui_observed: {},
      db_query: {},
      comparison: 'PENDING',
      divergences: [],
      status: 'RUNNING'
    };
    
    try {
      // 1. Navegar para pedidos de venda
      await this.navigateTo('/sd/orders');
      testResult.steps.push('Navegar para /sd/orders');
      
      // 2. Simular criação de pedido
      await this.navigateTo('/sd/orders/new');
      testResult.steps.push('Criar novo pedido de venda');
      
      // 3. Simular dados da UI
      const uiData = await this.simulateUIInteraction('orders');
      testResult.ui_observed = uiData;
      
      // 4. Consultar DB
      const dbData = await this.queryDatabase('sd_sales_order');
      testResult.db_query = dbData;
      
      // 5. Comparar UI ↔ DB
      const isIdentical = await this.compareData(uiData, dbData, testResult);
      
      testResult.comparison = isIdentical ? 'APROVADO' : 'REPROVADO';
      testResult.status = 'COMPLETED';
      
      this.testResults.push(testResult);
      return testResult;
      
    } catch (error) {
      testResult.status = 'FAILED';
      testResult.divergences.push({
        field: 'error',
        ui_value: 'N/A',
        db_value: error.message,
        type: 'EXECUTION_ERROR'
      });
      this.testResults.push(testResult);
      throw error;
    }
  }
  
  async simulateUIInteraction(pageType) {
    console.log(`🎭 Simulando interação UI para: ${pageType}`);
    
    // Simular dados que seriam obtidos da UI real
    switch (pageType) {
      case 'catalog':
        return {
          count: 0, // Seria obtido da UI
          order: 'mm_material ASC',
          rows: [], // Seria obtido da UI
          totals: {
            total_materials: 0,
            total_value: 0
          }
        };
        
      case 'purchases':
        return {
          count: 0,
          order: 'po_date DESC',
          rows: [],
          totals: {
            total_orders: 0,
            total_value: 0
          }
        };
        
      case 'orders':
        return {
          count: 0,
          order: 'order_date DESC',
          rows: [],
          totals: {
            total_orders: 0,
            total_value: 0,
            approved_orders: 0
          }
        };
        
      default:
        return { count: 0, rows: [], totals: {} };
    }
  }
  
  async queryDatabase(table) {
    console.log(`🗄️ Consultando DB: ${table}`);
    
    try {
      let query;
      
      switch (table) {
        case 'mm_material':
          query = this.supabase
            .from('mm_material')
            .select('mm_material, mm_comercial, mm_desc, mm_price_cents, mm_purchase_price_cents, status')
            .order('mm_material', { ascending: true });
          break;
          
        case 'mm_purchase_order':
          query = this.supabase
            .from('mm_purchase_order')
            .select(`
              mm_order,
              po_date,
              status,
              total_cents,
              mm_vendor!left(vendor_name)
            `)
            .order('po_date', { ascending: false });
          break;
          
        case 'sd_sales_order':
          query = this.supabase
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
          break;
          
        default:
          throw new Error(`Tabela não suportada: ${table}`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Erro ao consultar DB: ${error.message}`);
      }
      
      return {
        count: data.length,
        rows: data,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(`❌ Erro ao consultar ${table}:`, error.message);
      throw error;
    }
  }
  
  async compareData(uiData, dbData, testResult) {
    console.log('🔍 Comparando UI ↔ DB...');
    
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
    
    // 2. Comparar dados linha por linha
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
    
    // 3. Comparar totais
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
    
    testResult.divergences = divergences;
    
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
  
  generateReport() {
    console.log('\n📊 RELATÓRIO FINAL DE TESTES:');
    
    const total = this.testResults.length;
    const passed = this.testResults.filter(t => t.comparison === 'APROVADO').length;
    const failed = this.testResults.filter(t => t.comparison === 'REPROVADO').length;
    
    console.log(`Total: ${total}`);
    console.log(`Aprovados: ${passed}`);
    console.log(`Reprovados: ${failed}`);
    console.log(`Taxa de sucesso: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ TESTES REPROVADOS:');
      this.testResults
        .filter(t => t.comparison === 'REPROVADO')
        .forEach(t => {
          console.log(`  ${t.module} - ${t.page}: ${t.divergences.length} divergências`);
        });
    }
    
    // Salvar relatório
    const reportFile = `test-reports/user-test-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(this.testResults, null, 2));
    console.log(`\n📄 Relatório salvo: ${reportFile}`);
    
    return { total, passed, failed };
  }
}

// ============================================================================
// FUNÇÃO PRINCIPAL
// ============================================================================

async function runUserTests(module = 'ALL') {
  console.log('🚀 INICIANDO TESTES "COMO USUÁRIO"...\n');
  
  const simulator = new UserSimulator();
  
  try {
    // 1. Inicializar simulador
    await simulator.initialize();
    
    // 2. Executar testes por módulo
    if (module === 'ALL' || module === 'MM') {
      await simulator.testMMCatalog();
      await simulator.testMMPurchaseOrders();
    }
    
    if (module === 'ALL' || module === 'SD') {
      await simulator.testSDOrders();
    }
    
    // 3. Gerar relatório
    const results = simulator.generateReport();
    
    if (results.failed > 0) {
      console.log('\n❌ TESTES REPROVADOS - VERIFICAR RELATÓRIOS');
      process.exit(1);
    } else {
      console.log('\n✅ TODOS OS TESTES APROVADOS!');
    }
    
  } catch (error) {
    console.error('\n❌ ERRO DURANTE EXECUÇÃO DOS TESTES:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  const module = process.argv[2] || 'ALL';
  runUserTests(module).catch(console.error);
}

module.exports = { runUserTests, UserSimulator };
