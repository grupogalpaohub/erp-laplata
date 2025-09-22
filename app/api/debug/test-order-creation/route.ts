import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    
    console.log('Testing order creation for tenant:', tenantId)
    
    // Dados de teste
    const testOrder = {
      so_id: 'TEST-' + Date.now(),
      tenant_id: tenantId,
      customer_id: 'CUST-1758563669353', // Cliente existente
      order_date: '2025-09-22',
      total_cents: 10000,
      status: 'draft',
      created_at: new Date().toISOString()
    }
    
    console.log('Test order data:', testOrder)
    
    // Tentar inserir pedido
    const { data: orderData, error: orderError } = await supabase
      .from('sd_sales_order')
      .insert(testOrder)
      .select()
    
    if (orderError) {
      console.error('Order insert error:', orderError)
      return NextResponse.json({
        success: false,
        error: orderError.message,
        details: orderError
      })
    }
    
    console.log('Order created successfully:', orderData)
    
    // Tentar inserir item
    const testItem = {
      so_id: testOrder.so_id,
      tenant_id: tenantId,
      sku: 'G_193', // Material existente
      quantity: 1,
      unit_price_cents: 10000,
      line_total_cents: 10000,
      row_no: 1
    }
    
    const { data: itemData, error: itemError } = await supabase
      .from('sd_sales_order_item')
      .insert(testItem)
      .select()
    
    if (itemError) {
      console.error('Item insert error:', itemError)
      return NextResponse.json({
        success: false,
        error: itemError.message,
        details: itemError,
        orderCreated: true
      })
    }
    
    console.log('Item created successfully:', itemData)
    
    // Limpar dados de teste
    await supabase
      .from('sd_sales_order_item')
      .delete()
      .eq('so_id', testOrder.so_id)
    
    await supabase
      .from('sd_sales_order')
      .delete()
      .eq('so_id', testOrder.so_id)
    
    return NextResponse.json({
      success: true,
      message: 'Teste de criação de pedido bem-sucedido',
      orderData,
      itemData
    })
    
  } catch (error) {
    console.error('Test order creation error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error },
      { status: 500 }
    )
  }
}
