import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { so_id: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()
    const { so_id } = params

    // Buscar itens do pedido
    const { data: items, error } = await supabase
      .from('sd_sales_order_item')
      .select(`
        so_id,
        sku,
        quantity,
        unit_price_cents,
        line_total_cents,
        row_no,
        material_id
      `)
      .eq('tenant_id', tenantId)
      .eq('so_id', so_id)
      .order('row_no')

    if (error) {
      console.error('Error fetching order items:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar itens do pedido' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      items: items || []
    })

  } catch (error) {
    console.error('Error in order items GET:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}