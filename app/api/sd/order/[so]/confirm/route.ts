import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { so: string } }
) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    const soId = params.so

    // Buscar o pedido de venda
    const { data: order, error: fetchError } = await supabase
      .from('sd_sales_order')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('so_id', soId)
      .single()

    if (fetchError || !order) {
      return NextResponse.json(
        { error: 'Pedido de venda não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar status para 'confirmed' (dispara trigger de reserva)
    const { error: updateError } = await supabase
      .from('sd_sales_order')
      .update({ 
        status: 'confirmed',
        confirmed_at: new Date().toISOString()
      })
      .eq('tenant_id', tenantId)
      .eq('so_id', soId)

    if (updateError) {
      return NextResponse.json(
        { error: 'Erro ao confirmar pedido: ' + updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Pedido confirmado e estoque reservado',
      so_id: soId
    })

  } catch (error: any) {
    console.error('Error confirming order:', error)
    return NextResponse.json(
      { error: 'Erro interno: ' + error.message },
      { status: 500 }
    )
  }
}
