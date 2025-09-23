import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    console.log('🧪 Testando criação de pedido de venda...');
    
    // Dados de teste
    const testOrder = {
      tenant_id: 'LaplataLunaria',
      customer_id: 'CUST-1758564216650', // Cliente existente
      order_date: new Date().toISOString().split('T')[0],
      status: 'draft',
      total_cents: 10000, // R$ 100,00
      total_final_cents: 10000,
      total_negotiated_cents: 10000,
      payment_method: 'PIX',
      payment_term: 'À vista',
      notes: 'Teste de criação automática'
    };
    
    // Inserir pedido (so_id será gerado automaticamente pelo trigger)
    const { data: salesOrder, error: orderError } = await supabase
      .from('sd_sales_order')
      .insert(testOrder)
      .select('so_id, doc_no, created_at')
      .single();
    
    if (orderError) {
      console.error('❌ Erro ao criar pedido:', orderError);
      return NextResponse.json({
        success: false,
        error: orderError.message
      }, { status: 500 });
    }
    
    console.log('✅ Pedido criado com sucesso!');
    console.log('SO_ID gerado:', salesOrder.so_id);
    console.log('DOC_NO:', salesOrder.doc_no);
    
    return NextResponse.json({
      success: true,
      message: 'Pedido de venda criado com sucesso!',
      order: salesOrder,
      triggerWorking: true
    });
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
