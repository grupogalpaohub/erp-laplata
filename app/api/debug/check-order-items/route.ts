import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    const soId = 'SO-2025-001'

    console.log('Checking order items for:', soId, 'tenant:', tenantId)

    // Verificar se o pedido existe
    const { data: order, error: orderError } = await supabase
      .from('sd_sales_order')
      .select('so_id, customer_id, status')
      .eq('tenant_id', tenantId)
      .eq('so_id', soId)
      .single()

    if (orderError) {
      console.error('Order error:', orderError)
      return NextResponse.json({ error: 'Order not found', details: orderError })
    }

    console.log('Order found:', order)

    // Verificar itens
    const { data: items, error: itemsError } = await supabase
      .from('sd_sales_order_item')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('so_id', soId)

    if (itemsError) {
      console.error('Items error:', itemsError)
      return NextResponse.json({ error: 'Items error', details: itemsError })
    }

    console.log('Items found:', items)

    return NextResponse.json({
      success: true,
      order,
      items: items || [],
      count: items?.length || 0
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { error: 'Debug error', details: error },
      { status: 500 }
    )
  }
}
