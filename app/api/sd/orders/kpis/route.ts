import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET() {
  const s = supabaseServer()

  const { count: totalOrders, error: tErr } = await s
    .from('sd_sales_order')
    .select('*', { count: 'exact', head: true })
  if (tErr) return NextResponse.json({ ok: false, error: { code: tErr.code, message: tErr.message } }, { status: 500 })

  const { count: approvedOrders, error: aErr } = await s
    .from('sd_sales_order')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')
  if (aErr) return NextResponse.json({ ok: false, error: { code: aErr.code, message: aErr.message } }, { status: 500 })

  // soma por itens (preço congelado no pedido)
  const { data: items, error: iErr } = await s
    .from('sd_sales_order_item')
    .select('line_total_cents')
  if (iErr) return NextResponse.json({ ok: false, error: { code: iErr.code, message: iErr.message } }, { status: 500 })

  const totalCents = (items ?? []).reduce((acc: number, r: any) => acc + Number(r.line_total_cents || 0), 0)
  const avgTicket = (totalOrders && totalOrders > 0) ? Math.round(totalCents / totalOrders) : 0

  return NextResponse.json({
    ok: true,
    data: {
      total_orders: totalOrders ?? 0,
      approved_orders: approvedOrders ?? 0,
      avg_ticket_cents: avgTicket
    }
  }, { status: 200 })
}