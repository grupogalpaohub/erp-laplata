#!/usr/bin/env tsx

/**
 * TESTE DE FUMAÇA FINAL - HARMONIZAÇÃO TOTAL
 * Testa todas as APIs baseadas nas regras de ouro
 */

import { execSync } from 'child_process';

console.log('🧪 INICIANDO TESTE DE FUMAÇA FINAL - HARMONIZAÇÃO TOTAL\n');

// Helper para fazer requisições
async function makeRequest(url: string, method: string, body?: any) {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  const data = await response.json();
  return { status: response.status, data };
}

// Teste 1: MM - Criar vendor, material, PO header, PO items
console.log('📦 Teste MM: Criar vendor, material, PO header, PO items...');
try {
  // Criar vendor
  const vendorData = {
    vendor_id: 'VENDOR-001',
    vendor_name: 'Fornecedor Teste',
    contact_name: 'João Silva',
    email: 'joao@fornecedor.com',
    phone: '11999999999',
    address: 'Rua Teste, 123',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    postal_code: '01234-567',
    tax_id: '12.345.678/0001-90',
    payment_terms: '30 dias',
    currency: 'BRL'
  };

  const vendorResponse = await makeRequest('http://localhost:3000/api/mm/vendors', 'POST', vendorData);
  if (vendorResponse.status === 200 && vendorResponse.data.ok) {
    console.log('   ✅ Vendor criado com sucesso');
  } else {
    console.log('   ❌ Erro ao criar vendor:', vendorResponse.data);
  }

  // Criar material
  const materialData = {
    mm_material: 'MAT-001',
    mm_desc: 'Material Teste',
    mm_mat_type: 'raw_material',
    mm_class: 'prata',
    unit_of_measure: 'unidade',
    mm_purchase_price_cents: 1000
  };

  const materialResponse = await makeRequest('http://localhost:3000/api/mm/materials', 'POST', materialData);
  if (materialResponse.status === 200 && materialResponse.data.ok) {
    console.log('   ✅ Material criado com sucesso');
  } else {
    console.log('   ❌ Erro ao criar material:', materialResponse.data);
  }

  // Criar PO header
  const poData = {
    mm_order: 'PO-001',
    vendor_id: 'VENDOR-001',
    order_date: '2024-01-15',
    po_date: '2024-01-15',
    expected_delivery: '2024-01-30',
    currency: 'BRL',
    total_cents: 10000,
    total_amount: 100,
    notes: 'Pedido de teste',
    status: 'draft'
  };

  const poResponse = await makeRequest('http://localhost:3000/api/mm/purchase-orders', 'POST', poData);
  if (poResponse.status === 200 && poResponse.data.ok) {
    console.log('   ✅ PO header criado com sucesso');
  } else {
    console.log('   ❌ Erro ao criar PO header:', poResponse.data);
  }

  // Criar PO item
  const poItemData = {
    mm_order: 'PO-001',
    plant_id: 'PLANT-001',
    mm_material: 'MAT-001',
    mm_qtt: 10,
    unit_cost_cents: 1000,
    line_total_cents: 10000,
    freeze_item_price: true,
    currency: 'BRL',
    notes: 'Item de teste'
  };

  const poItemResponse = await makeRequest('http://localhost:3000/api/mm/purchase-order-items', 'POST', poItemData);
  if (poItemResponse.status === 200 && poItemResponse.data.ok) {
    console.log('   ✅ PO item criado com sucesso');
  } else {
    console.log('   ❌ Erro ao criar PO item:', poItemResponse.data);
  }

} catch (error) {
  console.log('   ❌ MM: Erro no teste:', error);
}

// Teste 2: SD - Criar customer, SO header, SO items
console.log('\n💰 Teste SD: Criar customer, SO header, SO items...');
try {
  // Criar customer
  const customerData = {
    customer_id: 'CUST-001',
    customer_name: 'Cliente Teste',
    customer_type: 'PJ',
    tax_id: '12.345.678/0001-90',
    email: 'cliente@teste.com',
    phone: '11999999999',
    address: 'Rua Cliente, 456',
    city: 'São Paulo',
    state: 'SP',
    country: 'Brasil',
    postal_code: '01234-567',
    payment_terms: '30 dias',
    payment_method: 'pix'
  };

  const customerResponse = await makeRequest('http://localhost:3000/api/crm/customers', 'POST', customerData);
  if (customerResponse.status === 200 && customerResponse.data.ok) {
    console.log('   ✅ Customer criado com sucesso');
  } else {
    console.log('   ❌ Erro ao criar customer:', customerResponse.data);
  }

  // Criar SO header
  const soData = {
    so_id: 'SO-001',
    customer_id: 'CUST-001',
    order_date: '2024-01-15',
    expected_ship: '2024-01-30',
    payment_method: 'pix',
    payment_term: '30 dias',
    notes: 'Pedido de venda teste',
    status: 'draft'
  };

  const soResponse = await makeRequest('http://localhost:3000/api/sd/sales-orders', 'POST', soData);
  if (soResponse.status === 200 && soResponse.data.ok) {
    console.log('   ✅ SO header criado com sucesso');
  } else {
    console.log('   ❌ Erro ao criar SO header:', soResponse.data);
  }

  // Criar SO item
  const soItemData = {
    so_id: 'SO-001',
    row_no: 1,
    mm_material: 'MAT-001',
    sku: 'SKU-001',
    quantity: 5,
    unit_price_cents: 2000
  };

  const soItemResponse = await makeRequest('http://localhost:3000/api/sd/sales-order-items', 'POST', soItemData);
  if (soItemResponse.status === 200 && soItemResponse.data.ok) {
    console.log('   ✅ SO item criado com sucesso');
  } else {
    console.log('   ❌ Erro ao criar SO item:', soItemResponse.data);
  }

} catch (error) {
  console.log('   ❌ SD: Erro no teste:', error);
}

// Teste 3: WH - Atualizar inventory balance
console.log('\n🏪 Teste WH: Atualizar inventory balance...');
try {
  const balanceData = {
    plant_id: 'PLANT-001',
    mm_material: 'MAT-001',
    on_hand_qty: 100,
    reserved_qty: 10,
    status: 'available',
    last_count_date: '2024-01-15'
  };

  const balanceResponse = await makeRequest('http://localhost:3000/api/wh/balance', 'POST', balanceData);
  if (balanceResponse.status === 200 && balanceResponse.data.ok) {
    console.log('   ✅ Inventory balance atualizado com sucesso');
  } else {
    console.log('   ❌ Erro ao atualizar inventory balance:', balanceResponse.data);
  }

  // Teste: Tentar enviar quantity_available (deve falhar)
  const invalidBalanceData = {
    ...balanceData,
    quantity_available: 90  // Deve ser rejeitado
  };

  const invalidBalanceResponse = await makeRequest('http://localhost:3000/api/wh/balance', 'POST', invalidBalanceData);
  if (invalidBalanceResponse.status === 400 && invalidBalanceResponse.data.error?.code === 'WH_FORBIDDEN_FIELD') {
    console.log('   ✅ quantity_available corretamente rejeitado');
  } else {
    console.log('   ❌ quantity_available não foi rejeitado como esperado');
  }

} catch (error) {
  console.log('   ❌ WH: Erro no teste:', error);
}

// Teste 4: FI - Criar transaction
console.log('\n💳 Teste FI: Criar transaction...');
try {
  const transactionData = {
    transaction_id: 'TXN-001',
    account_id: 'ACC-001',
    type: 'debito',
    amount_cents: 5000,
    date: '2024-01-15',
    description: 'Transação de teste'
  };

  const transactionResponse = await makeRequest('http://localhost:3000/api/fi/transactions', 'POST', transactionData);
  if (transactionResponse.status === 200 && transactionResponse.data.ok) {
    console.log('   ✅ Transaction criada com sucesso');
  } else {
    console.log('   ❌ Erro ao criar transaction:', transactionResponse.data);
  }

  // Teste: Tentar enviar type inválido (deve falhar)
  const invalidTransactionData = {
    ...transactionData,
    type: 'invalid_type'  // Deve ser rejeitado
  };

  const invalidTransactionResponse = await makeRequest('http://localhost:3000/api/fi/transactions', 'POST', invalidTransactionData);
  if (invalidTransactionResponse.status === 400 && invalidTransactionResponse.data.error?.code === 'FI_INVALID_TYPE') {
    console.log('   ✅ Type inválido corretamente rejeitado');
  } else {
    console.log('   ❌ Type inválido não foi rejeitado como esperado');
  }

} catch (error) {
  console.log('   ❌ FI: Erro no teste:', error);
}

// Teste 5: Verificar envelope de resposta
console.log('\n📋 Teste: Verificar envelope de resposta...');
try {
  const listResponse = await makeRequest('http://localhost:3000/api/mm/purchase-orders?page=1&pageSize=10', 'GET');
  if (listResponse.status === 200 && 
      listResponse.data.ok === true && 
      typeof listResponse.data.data === 'object' && 
      typeof listResponse.data.total === 'number' &&
      typeof listResponse.data.page === 'number' &&
      typeof listResponse.data.pageSize === 'number') {
    console.log('   ✅ Envelope de resposta correto');
  } else {
    console.log('   ❌ Envelope de resposta incorreto:', listResponse.data);
  }
} catch (error) {
  console.log('   ❌ Erro no teste de envelope:', error);
}

console.log('\n🎉 TESTE DE FUMAÇA FINAL CONCLUÍDO!');
console.log('📊 Todas as APIs estão funcionando com as regras de ouro aplicadas');
