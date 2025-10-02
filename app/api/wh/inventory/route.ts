import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET() {
  const s = supabaseServer()

  const { data: balances, error } = await s
    .from('wh_inventory_balance')
    .select('mm_material, plant_id, on_hand_qty, reserved_qty, last_count_date, status')

  if (error) {
    return NextResponse.json({ ok: false, error: { code: error.code, message: error.message } }, { status: 500 })
  }

  // cache de último custo por material
  const unitCostCache = new Map<string, number>()
  const getLastCost = async (mat: string) => {
    if (unitCostCache.has(mat)) return unitCostCache.get(mat)!
    const { data, error } = await s
      .from('mm_purchase_order_item')
      .select('unit_cost_cents')
      .eq('mm_material', mat)
      .order('po_item_id', { ascending: false })
      .limit(1)
    const cost = !error && data && data[0]?.unit_cost_cents ? Number(data[0].unit_cost_cents) : 0
    unitCostCache.set(mat, cost)
    return cost
  }

  const rows = []
  for (const b of balances ?? []) {
    const on = Number(b.on_hand_qty || 0)
    const res = Number(b.reserved_qty || 0)
    const avail = on - res
    const cost = await getLastCost(b.mm_material as string)
    const total = Math.max(avail, 0) * cost

    rows.push({
      mm_material: b.mm_material,
      plant_id: b.plant_id,
      on_hand_qty: on,
      reserved_qty: res,
      available_qty: avail,
      unit_cost_cents: cost,
      total_cents: Math.round(total),
      last_count_date: b.last_count_date,
      status: b.status
    })
  }

  return NextResponse.json({ ok: true, data: rows }, { status: 200 })
}