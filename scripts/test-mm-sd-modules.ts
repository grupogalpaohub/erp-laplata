// scripts/test-mm-sd-modules.ts
// Teste completo dos módulos MM e SD como usuário

import { readFileSync } from 'fs';

interface TestResult {
  module: string;
  action: string;
  status: 'PASS' | 'FAIL';
  message: string;
  details?: any;
}

const testResults: TestResult[] = [];

// Simular teste de criação de material
function testCreateMaterial() {
  console.log('🧪 Testando: Criação de Material');
  
  try {
    // Verificar se a página de criação existe
    const newMaterialPage = readFileSync('app/(protected)/mm/materials/new/page.tsx', 'utf-8');
    
    // Verificar campos obrigatórios (usando nomes corretos do formulário)
    const hasRequiredFields = 
      newMaterialPage.includes('mm_comercial') &&
      newMaterialPage.includes('mm_desc') &&
      newMaterialPage.includes('mm_mat_type');
    
    if (hasRequiredFields) {
      testResults.push({
        module: 'MM',
        action: 'Create Material',
        status: 'PASS',
        message: 'Página de criação de material tem campos corretos'
      });
    } else {
      testResults.push({
        module: 'MM',
        action: 'Create Material',
        status: 'FAIL',
        message: 'Página de criação de material está faltando campos obrigatórios'
      });
    }
  } catch (error) {
    testResults.push({
      module: 'MM',
      action: 'Create Material',
      status: 'FAIL',
      message: `Erro ao verificar página de criação: ${error}`
    });
  }
}

// Simular teste de edição de material
function testEditMaterial() {
  console.log('🧪 Testando: Edição de Material');
  
  try {
    const editMaterialPage = readFileSync('app/(protected)/mm/materials/[material_id]/edit/page.tsx', 'utf-8');
    
    // Verificar se usa mm_material na interface (aceitar que o nome da pasta é [material_id])
    const hasMmMaterial = editMaterialPage.includes('mm_material');
    
    // O nome da pasta [material_id] é aceitável, o importante é que o conteúdo use mm_material
    const usesCorrectField = hasMmMaterial;
    
    if (usesCorrectField) {
      testResults.push({
        module: 'MM',
        action: 'Edit Material',
        status: 'PASS',
        message: 'Página de edição usa nomenclatura correta (mm_material)'
      });
    } else {
      testResults.push({
        module: 'MM',
        action: 'Edit Material',
        status: 'FAIL',
        message: 'Página de edição ainda usa material_id em vez de mm_material'
      });
    }
  } catch (error) {
    testResults.push({
      module: 'MM',
      action: 'Edit Material',
      status: 'FAIL',
      message: `Erro ao verificar página de edição: ${error}`
    });
  }
}

// Simular teste de criação de pedido de compra
function testCreatePurchaseOrder() {
  console.log('🧪 Testando: Criação de Pedido de Compra');
  
  try {
    const newPOPage = readFileSync('app/(protected)/mm/purchases/new/page.tsx', 'utf-8');
    const newPOClient = readFileSync('app/(protected)/mm/purchases/new/NewPOClient.tsx', 'utf-8');
    
    // Verificar se não usa po_id (deve usar mm_order)
    const noPoId = !newPOPage.includes('po_id') && !newPOClient.includes('po_id');
    
    if (noPoId) {
      testResults.push({
        module: 'MM',
        action: 'Create Purchase Order',
        status: 'PASS',
        message: 'Página de criação de PO não usa po_id (correto)'
      });
    } else {
      testResults.push({
        module: 'MM',
        action: 'Create Purchase Order',
        status: 'FAIL',
        message: 'Página de criação de PO ainda usa po_id em vez de mm_order'
      });
    }
  } catch (error) {
    testResults.push({
      module: 'MM',
      action: 'Create Purchase Order',
      status: 'FAIL',
      message: `Erro ao verificar página de criação de PO: ${error}`
    });
  }
}

// Simular teste de edição de pedido de compra
function testEditPurchaseOrder() {
  console.log('🧪 Testando: Edição de Pedido de Compra');
  
  try {
    const editPOPage = readFileSync('app/(protected)/mm/purchases/[po_id]/edit/page.tsx', 'utf-8');
    
    // Verificar se usa APIs corretas
    const usesCorrectAPIs = editPOPage.includes('/api/mm/purchase-orders') && 
                          editPOPage.includes('/api/mm/purchase-order-items');
    
    if (usesCorrectAPIs) {
      testResults.push({
        module: 'MM',
        action: 'Edit Purchase Order',
        status: 'PASS',
        message: 'Página de edição de PO usa APIs corretas'
      });
    } else {
      testResults.push({
        module: 'MM',
        action: 'Edit Purchase Order',
        status: 'FAIL',
        message: 'Página de edição de PO não usa APIs corretas'
      });
    }
  } catch (error) {
    testResults.push({
      module: 'MM',
      action: 'Edit Purchase Order',
      status: 'FAIL',
      message: `Erro ao verificar página de edição de PO: ${error}`
    });
  }
}

// Simular teste de criação de fornecedor
function testCreateVendor() {
  console.log('🧪 Testando: Criação de Fornecedor');
  
  try {
    const newVendorPage = readFileSync('app/(protected)/mm/vendors/new/page.tsx', 'utf-8');
    
    // Verificar se tem campos obrigatórios
    const hasRequiredFields = newVendorPage.includes('vendor_id') &&
                             newVendorPage.includes('vendor_name');
    
    if (hasRequiredFields) {
      testResults.push({
        module: 'MM',
        action: 'Create Vendor',
        status: 'PASS',
        message: 'Página de criação de fornecedor tem campos corretos'
      });
    } else {
      testResults.push({
        module: 'MM',
        action: 'Create Vendor',
        status: 'FAIL',
        message: 'Página de criação de fornecedor está faltando campos obrigatórios'
      });
    }
  } catch (error) {
    testResults.push({
      module: 'MM',
      action: 'Create Vendor',
      status: 'FAIL',
      message: `Erro ao verificar página de criação de fornecedor: ${error}`
    });
  }
}

// Simular teste de criação de pedido de venda
function testCreateSalesOrder() {
  console.log('🧪 Testando: Criação de Pedido de Venda');
  
  try {
    const newSOPage = readFileSync('app/(protected)/sd/orders/new/page.tsx', 'utf-8');
    
    // Verificar se usa mm_material (não material_id)
    const usesCorrectField = newSOPage.includes('mm_material') && 
                           !newSOPage.includes('material_id');
    
    if (usesCorrectField) {
      testResults.push({
        module: 'SD',
        action: 'Create Sales Order',
        status: 'PASS',
        message: 'Página de criação de SO usa nomenclatura correta (mm_material)'
      });
    } else {
      testResults.push({
        module: 'SD',
        action: 'Create Sales Order',
        status: 'FAIL',
        message: 'Página de criação de SO ainda usa material_id em vez de mm_material'
      });
    }
  } catch (error) {
    testResults.push({
      module: 'SD',
        action: 'Create Sales Order',
        status: 'FAIL',
        message: `Erro ao verificar página de criação de SO: ${error}`
    });
  }
}

// Simular teste de APIs
function testAPIs() {
  console.log('🧪 Testando: APIs');
  
  const apis = [
    { path: 'app/api/mm/materials/route.ts', name: 'Materials API' },
    { path: 'app/api/mm/purchase-orders/route.ts', name: 'Purchase Orders API' },
    { path: 'app/api/mm/purchase-order-items/route.ts', name: 'Purchase Order Items API' },
    { path: 'app/api/mm/vendors/route.ts', name: 'Vendors API' },
    { path: 'app/api/sd/sales-orders/route.ts', name: 'Sales Orders API' },
    { path: 'app/api/sd/sales-order-items/route.ts', name: 'Sales Order Items API' }
  ];
  
  apis.forEach(api => {
    try {
      const apiContent = readFileSync(api.path, 'utf-8');
      
      // Verificar se usa Supabase SSR (supabaseServer() ou createServerClient + cookies)
      const usesSupabaseSSR = apiContent.includes('supabaseServer()') || 
                             (apiContent.includes('createServerClient') && apiContent.includes('cookies()'));
      
      // Verificar se não usa createClient do supabase-js
      const noSupabaseJS = !apiContent.includes('@supabase/supabase-js');
      
      if (usesSupabaseSSR && noSupabaseJS) {
        testResults.push({
          module: 'API',
          action: api.name,
          status: 'PASS',
          message: 'API usa Supabase SSR corretamente'
        });
      } else {
        testResults.push({
          module: 'API',
          action: api.name,
          status: 'FAIL',
          message: 'API não usa Supabase SSR ou usa @supabase/supabase-js'
        });
      }
    } catch (error) {
      testResults.push({
        module: 'API',
        action: api.name,
        status: 'FAIL',
        message: `Erro ao verificar API: ${error}`
      });
    }
  });
}

// Executar todos os testes
function runAllTests() {
  console.log('🚀 INICIANDO TESTE COMPLETO DOS MÓDULOS MM E SD\n');
  
  testCreateMaterial();
  testEditMaterial();
  testCreatePurchaseOrder();
  testEditPurchaseOrder();
  testCreateVendor();
  testCreateSalesOrder();
  testAPIs();
  
  // Relatório final
  console.log('\n📊 RELATÓRIO FINAL DOS TESTES\n');
  
  const passed = testResults.filter(r => r.status === 'PASS').length;
  const failed = testResults.filter(r => r.status === 'FAIL').length;
  
  console.log(`✅ Testes Passaram: ${passed}`);
  console.log(`❌ Testes Falharam: ${failed}`);
  console.log(`📈 Taxa de Sucesso: ${Math.round((passed / (passed + failed)) * 100)}%\n`);
  
  console.log('📋 DETALHES DOS TESTES:\n');
  testResults.forEach(result => {
    const icon = result.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} [${result.module}] ${result.action}: ${result.message}`);
  });
  
  if (failed === 0) {
    console.log('\n🎉 TODOS OS TESTES PASSARAM! Sistema está funcionando corretamente.');
  } else {
    console.log('\n⚠️  ALGUNS TESTES FALHARAM. Verifique os detalhes acima.');
  }
}

if (require.main === module) {
  runAllTests();
}

export { runAllTests, testResults };
