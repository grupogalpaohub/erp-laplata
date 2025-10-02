import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(
  request: Request,
  { params }: { params: { shipment_id: string } }
) {
  try {
    const supabase = supabaseServer()
    const { shipment_id } = params

    // Obter tenant_id da sessão
    const { data: { session } } = await supabase.auth.getSession()
    const tenant_id = session?.user?.user_metadata?.tenant_id || 'LaplataLunaria'

    // Verificar se o shipment existe e está allocated
    const { data: shipment, error: shipmentError } = await supabase
      .from('sd_shipment')
      .select('shipment_id, so_id, status, warehouse_id')
      .eq('shipment_id', shipment_id)
      .eq('tenant_id', tenant_id)
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

    // Atualizar status do shipment para shipped
    const { error: updateError } = await supabase
      .from('sd_shipment')
      .update({ 
        status: 'shipped',
        ship_date: new Date().toISOString().split('T')[0] // hoje
      })
      .eq('shipment_id', shipment_id)
      .eq('tenant_id', tenant_id)

    if (updateError) {
      console.error('Error updating shipment status:', updateError)
      return NextResponse.json({
        ok: false,
        error: { code: 'UPDATE_ERROR', message: updateError.message }
      }, { status: 500 })
    }

    // Atualizar status do pedido para shipped
    const { error: orderUpdateError } = await supabase
      .from('sd_sales_order')
      .update({ status: 'shipped' })
      .eq('so_id', shipment.so_id)
      .eq('tenant_id', tenant_id)

    if (orderUpdateError) {
      console.error('Error updating order status:', orderUpdateError)
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
    console.error('Error shipping order:', error)
    return NextResponse.json({
      ok: false,
      error: { message: String(error?.message ?? error) }
    }, { status: 500 })
  }
}
