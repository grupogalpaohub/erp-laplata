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
    .select('tenant_id, mm_order, vendor_id, order_date, expected_delivery, status, total_cents, created_at')
    .eq('mm_order', orderId)
    .single()

  if (headerError) {
    const status = headerError.code === 'PGRST116' ? 404 : 500
    return NextResponse.json({ ok: false, error: { code: headerError.code, message: headerError.message } }, { status })
  }

  const { data: items, error: itemsError } = await supabase
    .from('mm_purchase_order_item')
    .select('po_item_id, mm_order, plant_id, mm_material, mm_qtt, unit_cost_cents, line_total_cents, currency, notes')
    .eq('mm_order', orderId)
    .order('po_item_id', { ascending: true })

  if (itemsError) {
    return NextResponse.json({ ok: false, error: { code: itemsError.code, message: itemsError.message } }, { status: 500 })
  }

  return NextResponse.json({ ok: true, data: { header, items: items ?? [] } }, { status: 200 })
}