import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET() {
  const s = supabaseServer()

  // total de materiais
  const { count: materialsCount, error: mErr } = await s
    .from('mm_material')
    .select('*', { count: 'exact', head: true })
  if (mErr) return NextResponse.json({ ok: false, error: { code: mErr.code, message: mErr.message } }, { status: 500 })

  // total de POs
  const { count: poCount, error: poErr } = await s
    .from('mm_purchase_order')
    .select('*', { count: 'exact', head: true })
  if (poErr) return NextResponse.json({ ok: false, error: { code: poErr.code, message: poErr.message } }, { status: 500 })

  // compras do mês e acumulado
  const startMonth = new Date()
  startMonth.setDate(1); startMonth.setHours(0,0,0,0)
  const { data: monthOrders, error: moErr } = await s
    .from('mm_purchase_order')
    .select('total_cents, order_date')
    .gte('order_date', startMonth.toISOString().slice(0,10))
  if (moErr) return NextResponse.json({ ok: false, error: { code: moErr.code, message: moErr.message } }, { status: 500 })

  const { data: allOrders, error: aoErr } = await s
    .from('mm_purchase_order')
    .select('total_cents')
  if (aoErr) return NextResponse.json({ ok: false, error: { code: aoErr.code, message: aoErr.message } }, { status: 500 })

  const monthPurchases = (monthOrders ?? []).reduce((acc: number, r: any) => acc + Number(r.total_cents || 0), 0)
  const totalPurchases = (allOrders ?? []).reduce((acc: number, r: any) => acc + Number(r.total_cents || 0), 0)

  return NextResponse.json({
    ok: true,
    data: {
      total_materials: materialsCount ?? 0,
      total_purchase_orders: poCount ?? 0,
      month_purchases_cents: monthPurchases,
      total_purchases_cents: totalPurchases
    }
  }, { status: 200 })
}