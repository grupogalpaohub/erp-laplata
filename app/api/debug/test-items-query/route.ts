import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    const so_id = 'SO-1758634208624'

    // Teste 1: Buscar itens sem relacionamento
    const { data: itemsSimple, error: errorSimple } = await supabase
      .from('sd_sales_order_item')
      .select('so_id, sku, quantity, unit_price_cents, line_total_cents, row_no')
      .eq('tenant_id', tenantId)
      .eq('so_id', so_id)
      .order('row_no')

    if (errorSimple) {
      return NextResponse.json({
        success: false,
        error: 'Erro na query simples',
        details: errorSimple.message
      })
    }

    // Teste 2: Buscar itens com relacionamento
    const { data: itemsWithRel, error: errorRel } = await supabase
      .from('sd_sales_order_item')
      .select(`
        so_id,
        sku,
        quantity,
        unit_price_cents,
        line_total_cents,
        row_no,
        mm_material(mm_material, mm_comercial, mm_desc)
      `)
      .eq('tenant_id', tenantId)
      .eq('so_id', so_id)
      .order('row_no')

    if (errorRel) {
      return NextResponse.json({
        success: false,
        error: 'Erro na query com relacionamento',
        details: errorRel.message,
        simpleItems: itemsSimple
      })
    }

    return NextResponse.json({
      success: true,
      simpleItems: itemsSimple,
      itemsWithRel: itemsWithRel
    })

  } catch (error) {
    console.error('Error in test:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
