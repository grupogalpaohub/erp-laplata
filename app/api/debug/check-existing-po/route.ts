import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    // Verificar se há pedidos existentes
    const { data: orders, error: ordersError } = await supabase
      .from('mm_purchase_order')
      .select('mm_order, created_at')
      .eq('tenant_id', tenantId)
      .limit(5)

    // Verificar se há itens existentes
    const { data: items, error: itemsError } = await supabase
      .from('mm_purchase_order_item')
      .select('*')
      .eq('tenant_id', tenantId)
      .limit(5)

    return NextResponse.json({
      success: true,
      orders: orders || [],
      ordersError: ordersError?.message,
      items: items || [],
      itemsError: itemsError?.message,
      tenantId
    })

  } catch (error) {
    console.error('Error in check:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
