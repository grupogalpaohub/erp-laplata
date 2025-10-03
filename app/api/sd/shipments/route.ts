import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer()
    
    // GUARDRAIL: Verificar autenticação via supabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({
        ok: false,
        error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado' }
      }, { status: 401 })
    }

    const body = await req.json()
    const { so_id, warehouse_id, notes } = body

    if (!so_id || !warehouse_id) {
      return NextResponse.json({ 
        ok: false, 
        error: { message: 'so_id e warehouse_id são obrigatórios' } 
      }, { status: 400 })
    }

    // Validar se o SO tem itens - RLS filtra automaticamente por tenant_id
    const { data: orderItems, error: itemsError } = await supabase
      .from('sd_sales_order_item')
      .select('mm_material, quantity')
      .eq('so_id', so_id)

    if (itemsError || !orderItems || orderItems.length === 0) {
      return NextResponse.json({ 
        ok: false, 
        error: { message: 'Pedido não encontrado ou sem itens' } 
      }, { status: 404 })
    }

    // Criar shipment (trigger do banco fará a baixa/ledger) - RLS filtra automaticamente por tenant_id
    const shipmentId = `SHIP-${uuidv4()}`
    const { data: shipmentData, error: createError } = await supabase
      .from('sd_shipment')
      .insert({
        shipment_id: shipmentId,
        so_id: so_id,
        warehouse_id: warehouse_id,
        ship_date: new Date().toISOString().split('T')[0],
        status: 'allocated',
        notes: notes || null
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating shipment:', createError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: createError.code, message: createError.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      ok: true, 
      data: shipmentData 
    }, { status: 200 })

  } catch (error) {
    console.error('Unexpected error in POST /api/sd/shipments:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' } 
    }, { status: 500 })
  }
}