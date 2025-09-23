import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    console.log('🧪 Teste simples de criação de pedido...');
    
    // Dados mínimos para teste
    const testOrder = {
      tenant_id: 'LaplataLunaria',
      customer_id: 'CUST-1758564216650',
      order_date: '2025-09-22',
      status: 'draft',
      total_cents: 5000
    };
    
    console.log('Dados do pedido:', testOrder);
    
    // Inserir pedido
    const { data: salesOrder, error: orderError } = await supabase
      .from('sd_sales_order')
      .insert(testOrder)
      .select('so_id, created_at')
      .single();
    
    if (orderError) {
      console.error('❌ Erro ao criar pedido:', orderError);
      return NextResponse.json({
        success: false,
        error: orderError.message,
        details: orderError
      }, { status: 500 });
    }
    
    console.log('✅ Pedido criado! SO_ID:', salesOrder.so_id);
    
    return NextResponse.json({
      success: true,
      message: 'Pedido criado com sucesso!',
      so_id: salesOrder.so_id,
      created_at: salesOrder.created_at
    });
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
