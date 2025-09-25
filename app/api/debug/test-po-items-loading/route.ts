import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getTenantId } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    const tenantId = await getTenantId()

    // Testar busca de pedidos de compra
    const { data: orders, error: ordersError } = await supabase
      .from('mm_purchase_order')
      .select('mm_order, vendor_id, total_cents, total_amount')
      .eq('tenant_id', tenantId)
      .order('mm_order', { ascending: false })
      .limit(5)

    if (ordersError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Erro ao buscar pedidos', 
        details: ordersError 
      }, { status: 500 })
    }

    // Testar busca de itens para cada pedido
    const ordersWithItems = await Promise.all(
      (orders || []).map(async (order) => {
        const { data: items, error: itemsError } = await supabase
          .from('mm_purchase_order_item')
          .select('*')
          .eq('mm_order', order.mm_order)
          .eq('tenant_id', tenantId)

        return {
          ...order,
          items: items || [],
          itemsError: itemsError?.message || null
        }
      })
    )

    return NextResponse.json({
      success: true,
      tenantId,
      ordersCount: orders?.length || 0,
      ordersWithItems
    })

  } catch (error: any) {
    console.error('Erro inesperado no test-po-items-loading:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

