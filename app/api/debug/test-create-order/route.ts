import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    
    console.log('Testing order creation for tenant:', tenantId)
    
    // Gerar ID manual simples
    const { data: lastOrder } = await supabase
      .from('sd_sales_order')
      .select('so_id')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(1)

    const lastOrderNumber = lastOrder?.[0]?.so_id || 'SO-2025-000'
    const nextNumber = parseInt(lastOrderNumber.split('-')[2]) + 1
    const newSoId = `SO-2025-${nextNumber.toString().padStart(3, '0')}`
    
    console.log('Generated SO ID:', newSoId)
    
    // Dados de teste
    const testOrder = {
      so_id: newSoId,
      tenant_id: tenantId,
      customer_id: 'CUST-1758563669353',
      order_date: '2025-09-22',
      total_cents: 10000,
      total_negotiated_cents: 10000,
      status: 'draft'
    }
    
    console.log('Test order data:', testOrder)
    
    // Tentar inserir pedido diretamente
    const { data: orderData, error: orderError } = await supabase
      .from('sd_sales_order')
      .insert(testOrder)
      .select()
    
    if (orderError) {
      console.error('Order insert error:', orderError)
      return NextResponse.json({
        success: false,
        error: orderError.message,
        details: orderError,
        code: orderError.code
      })
    }
    
    console.log('Order created successfully:', orderData)
    
    // Tentar inserir item
    const testItem = {
      so_id: newSoId,
      tenant_id: tenantId,
      sku: 'G_193',
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
      .eq('so_id', newSoId)
    
    await supabase
      .from('sd_sales_order')
      .delete()
      .eq('so_id', newSoId)
    
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
