const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://gpjcfwjssfvqhppxdudp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwamNmd2pzc2Z2cWhwcHhkdWRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk0NDI5NSwiZXhwIjoyMDczNTIwMjk1fQ.QX3vlHLduidBh1HFFklS4P9xkL5xhe9oOnhZ2fc3-_s'
);

async function checkImportedMaterials() {
  console.log('🔍 VERIFICANDO MATERIAIS IMPORTADOS NO BANCO DE DADOS');
  console.log('=' .repeat(60));
  
  const { data, error } = await supabase
    .from('mm_material')
    .select('mm_material, mm_comercial, mm_desc, mm_mat_type, mm_vendor_id, mm_price_cents, mm_purchase_price_cents, mm_pur_link, lead_time_days, status, created_at')
    .eq('tenant_id', 'LaplataLunaria')
    .in('mm_material', ['G_309', 'G_650', 'B_181'])
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ Erro ao buscar materiais:', error);
    return;
  }
  
  console.log(`📊 Encontrados ${data.length} materiais:`);
  console.log('');
  
  data.forEach(material => {
    console.log(`🆔 ID: ${material.mm_material}`);
    console.log(`📝 Nome: ${material.mm_comercial}`);
    console.log(`📄 Descrição: ${material.mm_desc}`);
    console.log(`🏷️  Tipo: ${material.mm_mat_type}`);
    console.log(`🏪 Fornecedor: ${material.mm_vendor_id}`);
    console.log(`💰 Preço Venda: R$ ${(material.mm_price_cents / 100).toFixed(2)}`);
    console.log(`💵 Preço Compra: R$ ${(material.mm_purchase_price_cents / 10000).toFixed(2)}`);
    console.log(`🔗 Link: ${material.mm_pur_link || 'N/A'}`);
    console.log(`⏱️  Lead Time: ${material.lead_time_days} dias`);
    console.log(`📊 Status: ${material.status}`);
    console.log(`📅 Criado: ${new Date(material.created_at).toLocaleString()}`);
    console.log('-' .repeat(40));
  });
  
  // Verificar se B_181 foi atualizado corretamente
  const b181 = data.find(m => m.mm_material === 'B_181');
  if (b181) {
    console.log('✅ B_181 foi atualizado com sucesso!');
    console.log(`   Nome atualizado: ${b181.mm_comercial}`);
    console.log(`   Descrição atualizada: ${b181.mm_desc}`);
  } else {
    console.log('❌ B_181 não foi encontrado!');
  }
}

checkImportedMaterials().catch(console.error);
