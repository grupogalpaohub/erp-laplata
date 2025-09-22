const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testRealPOCreation() {
  try {
    console.log('🧪 Testando criação de pedido de compra real...');
    console.log('📋 Dados do teste:');
    console.log('   - Fornecedor: Silvercrown');
    console.log('   - Material: B_176');
    console.log('   - Quantidade: 1 peça');
    console.log('');

    const tenantId = 'LaplataLunaria';
    
    // 1. Buscar fornecedor Silvercrown
    console.log('🔍 Buscando fornecedor Silvercrown...');
    const { data: vendors, error: vendorError } = await supabase
      .from('mm_vendor')
      .select('vendor_id, vendor_name')
      .eq('tenant_id', tenantId)
      .ilike('vendor_name', '%silvercrown%');
    
    if (vendorError) {
      console.error('❌ Erro ao buscar fornecedor:', vendorError);
      return;
    }
    
    if (!vendors || vendors.length === 0) {
      console.error('❌ Fornecedor Silvercrown não encontrado');
      return;
    }
    
    const vendor = vendors[0];
    console.log(`✅ Fornecedor encontrado: ${vendor.vendor_name} (${vendor.vendor_id})`);
    
    // 2. Buscar material B_176
    console.log('🔍 Buscando material B_176...');
    const { data: materials, error: materialError } = await supabase
      .from('mm_material')
      .select('mm_material, mm_comercial, mm_desc, mm_purchase_price_cents')
      .eq('tenant_id', tenantId)
      .eq('mm_material', 'B_176');
    
    if (materialError) {
      console.error('❌ Erro ao buscar material:', materialError);
      return;
    }
    
    if (!materials || materials.length === 0) {
      console.error('❌ Material B_176 não encontrado');
      return;
    }
    
    const material = materials[0];
    console.log(`✅ Material encontrado: ${material.mm_material} - ${material.mm_comercial || material.mm_desc}`);
    console.log(`   Preço de compra: R$ ${(material.mm_purchase_price_cents / 10000).toFixed(2)}`);
    
    // 3. Simular dados do formulário
    const formData = {
      vendor_id: vendor.vendor_id,
      po_date: new Date().toISOString().slice(0, 10),
      items: [{
        material: material.mm_material,
        quantity: 1,
        unitPrice: material.mm_purchase_price_cents / 10000,
        total: (material.mm_purchase_price_cents / 10000) * 1
      }]
    };
    
    console.log('');
    console.log('📝 Dados do pedido:');
    console.log(`   - Fornecedor: ${vendor.vendor_name}`);
    console.log(`   - Data: ${formData.po_date}`);
    console.log(`   - Material: ${material.mm_material}`);
    console.log(`   - Quantidade: 1`);
    console.log(`   - Preço unitário: R$ ${formData.items[0].unitPrice.toFixed(2)}`);
    console.log(`   - Total: R$ ${formData.items[0].total.toFixed(2)}`);
    console.log('');
    
    // 4. Chamar a API de criação
    console.log('🚀 Chamando API de criação de pedido...');
    const response = await fetch('http://localhost:3000/api/mm/purchases/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ Erro na API:', result.error);
      return;
    }
    
    console.log('✅ Pedido criado com sucesso!');
    console.log(`   - ID do pedido: ${result.mm_order}`);
    console.log(`   - Mensagem: ${result.message}`);
    
    // 5. Verificar se o pedido foi realmente criado no banco
    console.log('');
    console.log('🔍 Verificando pedido no banco de dados...');
    const { data: createdOrder, error: fetchError } = await supabase
      .from('mm_purchase_order')
      .select(`
        mm_order,
        vendor_id,
        po_date,
        status,
        total_amount,
        mm_vendor (vendor_name)
      `)
      .eq('mm_order', result.mm_order)
      .single();
    
    if (fetchError) {
      console.error('❌ Erro ao buscar pedido criado:', fetchError);
      return;
    }
    
    console.log('✅ Pedido confirmado no banco:');
    console.log(`   - ID: ${createdOrder.mm_order}`);
    console.log(`   - Fornecedor: ${createdOrder.mm_vendor?.vendor_name}`);
    console.log(`   - Data: ${createdOrder.po_date}`);
    console.log(`   - Status: ${createdOrder.status}`);
    console.log(`   - Total: R$ ${(createdOrder.total_amount / 10000).toFixed(2)}`);
    
    // 6. Verificar itens do pedido
    console.log('');
    console.log('🔍 Verificando itens do pedido...');
    const { data: orderItems, error: itemsError } = await supabase
      .from('mm_purchase_order_item')
      .select(`
        mm_material,
        mm_qtt,
        unit_cost_cents,
        line_total_cents,
        mm_material_data:mm_material (mm_comercial, mm_desc)
      `)
      .eq('mm_order', result.mm_order);
    
    if (itemsError) {
      console.error('❌ Erro ao buscar itens:', itemsError);
      return;
    }
    
    console.log('✅ Itens do pedido:');
    orderItems.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.mm_material} - ${item.mm_material_data?.mm_comercial || item.mm_material_data?.mm_desc}`);
      console.log(`      Quantidade: ${item.mm_qtt}`);
      console.log(`      Preço unitário: R$ ${(item.unit_cost_cents / 10000).toFixed(2)}`);
      console.log(`      Total da linha: R$ ${(item.line_total_cents / 10000).toFixed(2)}`);
    });
    
    console.log('');
    console.log('🎉 TESTE CONCLUÍDO COM SUCESSO!');
    console.log(`📋 Pedido ${result.mm_order} criado e verificado no banco de dados.`);
    
  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

testRealPOCreation();
