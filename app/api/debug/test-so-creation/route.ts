import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const tenantId = 'LaplataLunaria'

    // Gerar ID único baseado em timestamp
    const timestamp = Date.now()
    const uniqueId = `SO-${timestamp}`

    // Dados de teste para criação de pedido
    const testOrder = {
      tenant_id: tenantId,
      so_id: uniqueId,
      customer_id: 'CUST-1758564216650', // Cliente existente
      order_date: '2025-01-23',
      total_cents: 10000,
      total_final_cents: 10000,
      total_negotiated_cents: 9500,
      notes: 'Teste de criação',
      status: 'draft'
    }

    console.log('Tentando criar pedido de teste:', testOrder)

    const { data: orderData, error: orderError } = await supabase
      .from('sd_sales_order')
      .insert(testOrder)
      .select()
      .single()

    if (orderError) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao criar pedido de teste',
        details: orderError.message,
        code: orderError.code,
        hint: orderError.hint
      })
    }

    // Tentar criar item do pedido
    const testItem = {
      tenant_id: tenantId,
      so_id: orderData.so_id,
      sku: 'B_175', // SKU obrigatório
      material_id: 'B_175', // Material existente
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
      message: 'Criação de pedido funcionou',
      orderData,
      itemData,
      itemError: itemError?.message
    })

  } catch (error) {
    console.error('Erro no teste:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}