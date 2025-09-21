import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    const shipmentId = params.id

    // Buscar a expedição
    const { data: shipment, error: fetchError } = await supabase
      .from('sd_shipment')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('shipment_id', shipmentId)
      .single()

    if (fetchError || !shipment) {
      return NextResponse.json(
        { error: 'Expedição não encontrada' },
        { status: 404 }
      )
    }

    // Atualizar status para 'complete' (dispara trigger de baixa)
    const { error: updateError } = await supabase
      .from('sd_shipment')
      .update({ 
        status: 'complete',
        shipped_at: new Date().toISOString()
      })
      .eq('tenant_id', tenantId)
      .eq('shipment_id', shipmentId)

    if (updateError) {
      return NextResponse.json(
        { error: 'Erro ao completar expedição: ' + updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Expedição completada e estoque baixado',
      shipment_id: shipmentId
    })

  } catch (error: any) {
    console.error('Error completing shipment:', error)
    return NextResponse.json(
      { error: 'Erro interno: ' + error.message },
      { status: 500 }
    )
  }
}
