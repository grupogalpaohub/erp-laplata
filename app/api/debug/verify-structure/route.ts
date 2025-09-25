import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verificar se conseguimos inserir um pedido de teste com os novos campos
    const testOrder = {
      tenant_id: 'LaplataLunaria',
      customer_id: 'CUST-1758564216650', // Cliente existente
      order_date: '2025-01-23',
      status: 'draft',
      total_cents: 10000,
      doc_no: 'TEST-001',
      payment_method: 'PIX',
      payment_term: 'À Vista',
      total_final_cents: 10000,
      total_negotiated_cents: 9500,
      notes: 'Teste de estrutura'
    }

    // Tentar inserir pedido de teste
    const { data: orderData, error: orderError } = await supabase
      .from('sd_sales_order')
      .insert(testOrder)
      .select()
      .single()

    if (orderError) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao inserir pedido de teste',
        details: orderError.message,
        testOrder
      })
    }

    // Tentar inserir item de teste
    const testItem = {
      tenant_id: 'LaplataLunaria',
      so_id: orderData.so_id,
      sku: 'TEST-SKU',
      quantity: 1,
      unit_price_cents: 10000,
      line_total_cents: 10000,
      row_no: 1
    }

    const { data: itemData, error: itemError } = await supabase
      .from('sd_sales_order_item')
      .insert(testItem)
      .select()
      .single()

    // Limpar dados de teste
    await supabase
      .from('sd_sales_order_item')
      .delete()
      .eq('so_id', orderData.so_id)

    await supabase
      .from('sd_sales_order')
      .delete()
      .eq('so_id', orderData.so_id)

    return NextResponse.json({
      success: true,
      message: 'Estrutura verificada com sucesso!',
      orderData,
      itemData,
      itemError: itemError?.message,
      fieldsAvailable: {
        sd_sales_order: [
          'tenant_id', 'so_id', 'customer_id', 'status', 'order_date',
          'expected_ship', 'total_cents', 'created_at', 'doc_no',
          'payment_method', 'payment_term', 'total_final_cents',
          'total_negotiated_cents', 'notes', 'updated_at'
        ],
        sd_sales_order_item: [
          'tenant_id', 'so_id', 'sku', 'quantity', 'unit_price_cents',
          'line_total_cents', 'row_no'
        ]
      }
    })

  } catch (error) {
    console.error('Erro ao verificar estrutura:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

