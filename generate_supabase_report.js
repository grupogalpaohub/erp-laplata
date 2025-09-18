const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://gpjcfwjssfvqhppxdudp.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwamNmd2pzc2Z2cWhwcHhkdWRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk0NDI5NSwiZXhwIjoyMDczNTIwMjk1fQ.QX3vlHLduidBh1HFFklS4P9xkL5xhe9oOnhZ2fcb-_s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function generateDetailedReport() {
  console.log('📊 GERANDO RELATÓRIO DETALHADO DO SUPABASE');
  console.log('==========================================');

  try {
    // 1. Buscar todos os materiais com detalhes
    console.log('1️⃣ Buscando materiais...');
    const { data: materials, error: materialsError } = await supabase
      .from('mm_material')
      .select('*')
      .eq('tenant_id', 'LaplataLunaria')
      .order('mm_material');

    if (materialsError) {
      console.log('❌ Erro ao buscar materiais:', materialsError.message);
      return;
    }

    // 2. Buscar todos os itens de pedido de compra
    console.log('2️⃣ Buscando itens de pedido de compra...');
    const { data: poItems, error: poItemsError } = await supabase
      .from('mm_purchase_order_item')
      .select('*')
      .eq('tenant_id', 'LaplataLunaria')
      .order('mm_material');

    // 3. Buscar todos os recebimentos
    console.log('3️⃣ Buscando recebimentos...');
    const { data: receivings, error: receivingsError } = await supabase
      .from('mm_receiving')
      .select('*')
      .eq('tenant_id', 'LaplataLunaria')
      .order('mm_material');

    // 4. Buscar todos os saldos de estoque
    console.log('4️⃣ Buscando saldos de estoque...');
    const { data: inventory, error: inventoryError } = await supabase
      .from('wh_inventory_balance')
      .select('*')
      .eq('tenant_id', 'LaplataLunaria')
      .order('mm_material');

    // 5. Gerar relatório detalhado
    console.log('5️⃣ Gerando relatório...');
    
    const report = {
      metadata: {
        generated_at: new Date().toISOString(),
        supabase_url: supabaseUrl,
        tenant: 'LaplataLunaria',
        total_materials: materials.length,
        total_po_items: poItems?.length || 0,
        total_receivings: receivings?.length || 0,
        total_inventory_records: inventory?.length || 0
      },
      materials: materials.map(material => ({
        sku: material.mm_material,
        commercial_name: material.mm_comercial,
        description: material.mm_desc,
        type: material.mm_mat_type,
        class: material.mm_mat_class,
        price_cents: material.mm_price_cents,
        price_brl: (material.mm_price_cents / 100).toFixed(2),
        unit: material.unit_of_measure,
        min_stock: material.min_stock,
        max_stock: material.max_stock,
        lead_time_days: material.lead_time_days,
        status: material.status
      })),
      purchase_order_summary: {
        total_items: poItems?.length || 0,
        total_value_cents: poItems?.reduce((sum, item) => sum + item.line_total_cents, 0) || 0,
        total_value_brl: ((poItems?.reduce((sum, item) => sum + item.line_total_cents, 0) || 0) / 100).toFixed(2),
        average_item_value_cents: poItems?.length ? Math.round(poItems.reduce((sum, item) => sum + item.line_total_cents, 0) / poItems.length) : 0,
        average_item_value_brl: poItems?.length ? ((poItems.reduce((sum, item) => sum + item.line_total_cents, 0) / poItems.length) / 100).toFixed(2) : '0.00'
      },
      inventory_summary: {
        total_skus: inventory?.length || 0,
        total_quantity: inventory?.reduce((sum, item) => sum + item.on_hand_qty, 0) || 0,
        total_reserved: inventory?.reduce((sum, item) => sum + item.reserved_qty, 0) || 0,
        total_available: inventory?.reduce((sum, item) => sum + (item.on_hand_qty - item.reserved_qty), 0) || 0,
        total_value_cents: inventory?.reduce((sum, item) => {
          const material = materials.find(m => m.mm_material === item.mm_material);
          return sum + (item.on_hand_qty * (material?.mm_price_cents || 0));
        }, 0) || 0,
        total_value_brl: inventory?.length ? ((inventory.reduce((sum, item) => {
          const material = materials.find(m => m.mm_material === item.mm_material);
          return sum + (item.on_hand_qty * (material?.mm_price_cents || 0));
        }, 0)) / 100).toFixed(2) : '0.00'
      },
      categories_breakdown: {
        by_type: materials.reduce((acc, material) => {
          acc[material.mm_mat_type] = (acc[material.mm_mat_type] || 0) + 1;
          return acc;
        }, {}),
        by_class: materials.reduce((acc, material) => {
          acc[material.mm_mat_class] = (acc[material.mm_mat_class] || 0) + 1;
          return acc;
        }, {}),
        by_price_range: {
          '0-100': materials.filter(m => m.mm_price_cents < 10000).length,
          '100-200': materials.filter(m => m.mm_price_cents >= 10000 && m.mm_price_cents < 20000).length,
          '200-300': materials.filter(m => m.mm_price_cents >= 20000 && m.mm_price_cents < 30000).length,
          '300-400': materials.filter(m => m.mm_price_cents >= 30000 && m.mm_price_cents < 40000).length,
          '400+': materials.filter(m => m.mm_price_cents >= 40000).length
        }
      },
      detailed_inventory: inventory?.map(item => {
        const material = materials.find(m => m.mm_material === item.mm_material);
        return {
          sku: item.mm_material,
          commercial_name: material?.mm_comercial,
          description: material?.mm_desc,
          on_hand: item.on_hand_qty,
          reserved: item.reserved_qty,
          available: item.on_hand_qty - item.reserved_qty,
          unit_price_cents: material?.mm_price_cents || 0,
          unit_price_brl: material?.mm_price_cents ? (material.mm_price_cents / 100).toFixed(2) : '0.00',
          total_value_cents: item.on_hand_qty * (material?.mm_price_cents || 0),
          total_value_brl: ((item.on_hand_qty * (material?.mm_price_cents || 0)) / 100).toFixed(2),
          last_count_date: item.last_count_date,
          status: item.status
        };
      }) || []
    };

    // 6. Salvar relatório
    console.log('6️⃣ Salvando relatório...');
    fs.writeFileSync('/workspace/supabase_detailed_report.json', JSON.stringify(report, null, 2));
    
    // 7. Gerar relatório em Markdown
    console.log('7️⃣ Gerando relatório Markdown...');
    const markdownReport = generateMarkdownReport(report);
    fs.writeFileSync('/workspace/SUPABASE_DETAILED_REPORT.md', markdownReport);

    console.log('✅ Relatório gerado com sucesso!');
    console.log('📁 Arquivos criados:');
    console.log('   - supabase_detailed_report.json');
    console.log('   - SUPABASE_DETAILED_REPORT.md');

  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error);
  }
}

function generateMarkdownReport(report) {
  return `# 📊 Relatório Detalhado do Supabase - ERP Laplata

**Gerado em**: ${new Date().toLocaleString('pt-BR')}  
**Tenant**: ${report.metadata.tenant}  
**Total de Materiais**: ${report.metadata.total_materials}  

## 📈 Resumo Executivo

### Estoque
- **Total de SKUs**: ${report.inventory_summary.total_skus}
- **Quantidade Total**: ${report.inventory_summary.total_quantity} unidades
- **Valor Total do Estoque**: R$ ${report.inventory_summary.total_value_brl}
- **Quantidade Reservada**: ${report.inventory_summary.total_reserved} unidades
- **Quantidade Disponível**: ${report.inventory_summary.total_available} unidades

### Compras
- **Total de Itens Comprados**: ${report.purchase_order_summary.total_items}
- **Valor Total das Compras**: R$ ${report.purchase_order_summary.total_value_brl}
- **Valor Médio por Item**: R$ ${report.purchase_order_summary.average_item_value_brl}

## 🏷️ Categorias de Produtos

### Por Tipo
${Object.entries(report.categories_breakdown.by_type).map(([type, count]) => `- **${type}**: ${count} produtos`).join('\n')}

### Por Classificação
${Object.entries(report.categories_breakdown.by_class).map(([class_, count]) => `- **${class_}**: ${count} produtos`).join('\n')}

### Por Faixa de Preço
${Object.entries(report.categories_breakdown.by_price_range).map(([range, count]) => `- **R$ ${range}**: ${count} produtos`).join('\n')}

## 📦 Inventário Detalhado

| SKU | Nome Comercial | Descrição | Estoque | Preço Unit. | Valor Total |
|-----|----------------|-----------|---------|-------------|-------------|
${report.detailed_inventory.map(item => 
  `| ${item.sku} | ${item.commercial_name} | ${item.description.substring(0, 50)}... | ${item.on_hand} | R$ ${item.unit_price_brl} | R$ ${item.total_value_brl} |`
).join('\n')}

## 💎 Catálogo de Materiais

${report.materials.map(material => 
  `### ${material.sku} - ${material.commercial_name}
- **Descrição**: ${material.description}
- **Tipo**: ${material.type}
- **Classificação**: ${material.class}
- **Preço**: R$ ${material.price_brl}
- **Unidade**: ${material.unit}
- **Estoque Mínimo**: ${material.min_stock}
- **Estoque Máximo**: ${material.max_stock}
- **Lead Time**: ${material.lead_time_days} dias
- **Status**: ${material.status}

`
).join('\n')}

---
*Relatório gerado automaticamente pelo sistema de inspeção do Supabase*
`;
}

// Executar geração do relatório
generateDetailedReport();