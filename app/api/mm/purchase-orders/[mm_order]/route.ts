import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

type Params = { mm_order?: string; po_id?: string; id?: string }

export async function GET(_req: Request, { params }: { params: Params }) {
  const orderId = params?.mm_order ?? params?.po_id ?? params?.id ?? ''
  if (!orderId) {
    return NextResponse.json({ ok: false, error: { message: 'missing order id' } }, { status: 400 })
  }
  if (!orderId.startsWith('PO-')) {
    return NextResponse.json({ ok: false, error: { message: 'invalid order id' } }, { status: 400 })
  }

  const supabase = supabaseServer()

  const { data: header, error: headerError } = await supabase
    .from('mm_purchase_order')
    .select('tenant_id, mm_order, vendor_id, order_date, expected_delivery, status, total_cents, created_at, notes')
    .eq('mm_order', orderId)
    .single()

  if (headerError) {
    const status = headerError.code === 'PGRST116' ? 404 : 500
    return NextResponse.json({ ok: false, error: { code: headerError.code, message: headerError.message } }, { status })
  }

  const { data: items, error: itemsError } = await supabase
    .from('mm_purchase_order_item')
    .select(`
      po_item_id, 
      mm_order, 
      plant_id, 
      mm_material, 
      mm_qtt, 
      unit_cost_cents, 
      line_total_cents, 
      currency,
      mm_material_data:mm_material(mm_comercial, mm_desc)
    `)
    .eq('mm_order', orderId)
    .order('po_item_id', { ascending: true })

  if (itemsError) {
    return NextResponse.json({ ok: false, error: { code: itemsError.code, message: itemsError.message } }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data: { header, items: items ?? [] } }, { status: 200 })
}

export async function PUT(req: Request, { params }: { params: Params }) {
  const orderId = params?.mm_order ?? params?.po_id ?? params?.id ?? ''
  if (!orderId) {
    return NextResponse.json({ ok: false, error: { message: 'missing order id' } }, { status: 400 })
  }
  if (!orderId.startsWith('PO-')) {
    return NextResponse.json({ ok: false, error: { message: 'invalid order id' } }, { status: 400 })
  }

  try {
    const supabase = supabaseServer()
    const body = await req.json()

    // Validar campos obrigatórios
    if (!body.vendor_id) {
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: 'MISSING_VENDOR_ID', 
          message: 'vendor_id é obrigatório' 
        } 
      }, { status: 400 })
    }

    // Preparar dados para atualização - ✅ GUARDRAIL COMPLIANCE: Campos conforme db_contract.json
    const updateData = {
      vendor_id: body.vendor_id,
      order_date: body.order_date || new Date().toISOString().split('T')[0],
      status: body.status || 'draft',
      expected_delivery: body.expected_delivery || null,
      notes: body.notes || null,
      total_cents: body.total_cents || 0,
    }

    const { data, error } = await supabase
      .from('mm_purchase_order')
      .update(updateData)
      .eq('mm_order', orderId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar purchase order:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: (error as any).code, 
          message: error.message 
        } 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      ok: true, 
      data 
    }, { status: 200 })

  } catch (error) {
    console.error('Erro inesperado na API purchase orders PUT:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'Erro interno do servidor' 
      } 
    }, { status: 500 })
  }
}