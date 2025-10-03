import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'

export async function POST(
  request: Request,
  { params }: { params: { shipment_id: string } }
) {
  try {
    const supabase = supabaseServer()
    const { shipment_id } = params

    // GUARDRAIL: Verificar autenticação via supabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({
        ok: false,
        error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado' }
      }, { status: 401 })
    }

    // Verificar se o shipment existe e está allocated - RLS filtra automaticamente por tenant_id
    const { data: shipment, error: shipmentError } = await supabase
      .from('sd_shipment')
      .select('shipment_id, so_id, status, warehouse_id')
      .eq('shipment_id', shipment_id)
      .single()

    if (shipmentError || !shipment) {
      return NextResponse.json({
        ok: false,
        error: { code: 'SHIPMENT_NOT_FOUND', message: 'Shipment não encontrado' }
      }, { status: 404 })
    }

    if (shipment.status !== 'allocated') {
      return NextResponse.json({
        ok: false,
        error: { code: 'INVALID_STATUS', message: 'Shipment não está em status allocated' }
      }, { status: 400 })
    }

    // Atualizar status do shipment para shipped - RLS filtra automaticamente por tenant_id
    const { error: updateError } = await supabase
      .from('sd_shipment')
      .update({ 
        status: 'shipped',
        ship_date: new Date().toISOString().split('T')[0] // hoje
      })
      .eq('shipment_id', shipment_id)

    if (updateError) {
      return NextResponse.json({
        ok: false,
        error: { code: 'UPDATE_ERROR', message: updateError.message }
      }, { status: 500 })
    }

    // Atualizar status do pedido para shipped - RLS filtra automaticamente por tenant_id
    const { error: orderUpdateError } = await supabase
      .from('sd_sales_order')
      .update({ status: 'shipped' })
      .eq('so_id', shipment.so_id)

    if (orderUpdateError) {
      // Não falhar por causa do status do pedido
    }

    return NextResponse.json({
      ok: true,
      data: {
        shipment_id,
        status: 'shipped',
        message: 'Pedido enviado com sucesso'
      }
    })

  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' }
    }, { status: 500 })
  }
}
