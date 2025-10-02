import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET() {
  const s = supabaseServer()

  // 1) Carrega saldos
  const { data: balances, error: balErr } = await s
    .from('wh_inventory_balance')
    .select('mm_material, plant_id, on_hand_qty, reserved_qty')

  if (balErr) {
    return NextResponse.json({ ok: false, error: { code: balErr.code, message: balErr.message } }, { status: 500 })
  }

  // 2) Para cada material, buscar o último unit_cost_cents do PO item (se existir)
  //    (mínimo que funciona, sem criar view nem RPC)
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

  let totalItems = 0
  let outOfStock = 0
  let totalValue = 0

  // threshold para low stock — se não existir regra, deixar zerado (pode ajustar depois)
  const lowStockThreshold = 0
  let lowStock = 0

  // Agregação por material (somando plantas)
  const byMaterial = new Map<string, { on: number; res: number }>()
  for (const b of balances ?? []) {
    const on = Number(b.on_hand_qty || 0)
    const res = Number(b.reserved_qty || 0)
    const k = b.mm_material as string
    const prev = byMaterial.get(k) || { on: 0, res: 0 }
    byMaterial.set(k, { on: prev.on + on, res: prev.res + res })
  }

  for (const [mat, v] of byMaterial) {
    const avail = v.on - v.res
    if (v.on > 0) totalItems += 1
    if (v.on === 0) outOfStock += 1
    if (avail <= lowStockThreshold) lowStock += 1
    const cost = await getLastCost(mat)
    totalValue += Math.max(avail, 0) * cost
  }

  return NextResponse.json({
    ok: true,
    data: {
      total_items: totalItems,
      total_value_cents: Math.round(totalValue),
      low_stock: lowStock,
      out_of_stock: outOfStock
    }
  }, { status: 200 })
}
