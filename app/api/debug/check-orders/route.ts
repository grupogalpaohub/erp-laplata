import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    
    console.log('Checking orders for tenant:', tenantId)
    
    // Verificar pedidos
    const { data: orders, error: ordersError } = await supabase
      .from('sd_sales_order')
      .select(`
        so_id,
        doc_no,
        customer_id,
        status,
        order_date,
        total_cents,
        created_at,
        crm_customer(name)
      `)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (ordersError) {
      console.error('Orders error:', ordersError)
      return NextResponse.json({
        success: false,
        error: ordersError.message,
        details: ordersError
      })
    }
    
    // Para cada pedido, verificar itens
    const ordersWithItems = []
    for (const order of orders || []) {
      const { data: items, error: itemsError } = await supabase
        .from('sd_sales_order_item')
        .select(`
          so_id,
          sku,
          quantity,
          unit_price_cents,
          line_total_cents,
          row_no
        `)
        .eq('tenant_id', tenantId)
        .eq('so_id', order.so_id)
        .order('row_no')
      
      ordersWithItems.push({
        ...order,
        items: items || [],
        itemsError: itemsError?.message
      })
    }
    
    return NextResponse.json({
      success: true,
      tenantId,
      orders: ordersWithItems,
      ordersCount: orders?.length || 0,
      errors: {
        orders: ordersError?.message
      }
    })
    
  } catch (error) {
    console.error('Debug orders error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error },
      { status: 500 }
    )
  }
}
