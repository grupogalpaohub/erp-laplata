import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { so_id: string } }
) {
  try {
    const supabase = supabaseServer()
    const { so_id } = params

    // Obter tenant_id da sessão
    const { data: { session } } = await supabase.auth.getSession()
    const tenant_id = session?.user?.user_metadata?.tenant_id || 'LaplataLunaria'

    // Parse do body
    const body = await request.json()
    const { warehouse_id } = body

    if (!warehouse_id) {
      return NextResponse.json({
        ok: false,
        error: { code: 'MISSING_WAREHOUSE', message: 'Warehouse é obrigatório' }
      }, { status: 400 })
    }

    // Verificar se o pedido existe e está em draft
    const { data: order, error: orderError } = await supabase
      .from('sd_sales_order')
      .select('so_id, status, customer_id')
      .eq('so_id', so_id)
      .eq('tenant_id', tenant_id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({
        ok: false,
        error: { code: 'ORDER_NOT_FOUND', message: 'Pedido não encontrado' }
      }, { status: 404 })
    }

    if (order.status !== 'draft') {
      return NextResponse.json({
        ok: false,
        error: { code: 'INVALID_STATUS', message: 'Pedido não está em rascunho' }
      }, { status: 400 })
    }

    // Verificar se já existe shipment para este pedido
    const { data: existingShipment } = await supabase
      .from('sd_shipment')
      .select('shipment_id')
      .eq('so_id', so_id)
      .eq('tenant_id', tenant_id)
      .single()

    if (existingShipment) {
      return NextResponse.json({
        ok: false,
        error: { code: 'SHIPMENT_EXISTS', message: 'Pedido já possui shipment' }
      }, { status: 400 })
    }

    // Criar shipment
    const shipment_id = `SHIP-${Date.now()}`
    const { data: shipment, error: shipmentError } = await supabase
      .from('sd_shipment')
      .insert({
        tenant_id,
        shipment_id,
        so_id,
        warehouse_id,
        ship_date: new Date().toISOString().split('T')[0], // hoje
        status: 'allocated'
      })
      .select()
      .single()

    if (shipmentError) {
      console.error('Error creating shipment:', shipmentError)
      return NextResponse.json({
        ok: false,
        error: { code: 'SHIPMENT_CREATE_ERROR', message: shipmentError.message }
      }, { status: 500 })
    }

    // Atualizar status do pedido para approved
    const { error: updateError } = await supabase
      .from('sd_sales_order')
      .update({ status: 'approved' })
      .eq('so_id', so_id)
      .eq('tenant_id', tenant_id)

    if (updateError) {
      console.error('Error updating order status:', updateError)
      // Não falhar por causa do status, o shipment já foi criado
    }

    return NextResponse.json({
      ok: true,
      data: {
        shipment_id,
        status: 'allocated',
        message: 'Pedido confirmado e itens reservados'
      }
    })

  } catch (error: any) {
    console.error('Error confirming order:', error)
    return NextResponse.json({
      ok: false,
      error: { message: String(error?.message ?? error) }
    }, { status: 500 })
  }
}
