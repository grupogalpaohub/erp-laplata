import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET() {
  try {
    const TENANT = 'LaplataLunaria' // LOCAL
    const s = supabaseServer()

    // ✅ CORREÇÃO: Buscar inventário em 2 etapas (sem JOIN embutido)
    const { data: inventory, error: invError } = await s
      .from('wh_inventory_balance')
      .select('mm_material,on_hand_qty,reserved_qty,status')
      .eq('tenant_id', TENANT)

    if (invError) {
      return NextResponse.json({ ok: false, error: { code: invError.code, message: invError.message } }, { status: 500 })
    }

    const inventoryRows = inventory ?? []
    const total_items = inventoryRows.filter((r: any) => Number(r.on_hand_qty) > 0).length

    // ✅ CORREÇÃO: Buscar materiais para calcular valor total
    const materialIds = [...new Set(inventoryRows.map(r => r.mm_material))]
    let total_value_cents = 0

    if (materialIds.length > 0) {
      const { data: materials, error: matError } = await s
        .from('mm_material')
        .select('mm_material,mm_purchase_price_cents')
        .in('mm_material', materialIds)

      if (!matError && materials) {
        // Join em memória + cálculo de valor total
        const materialMap = new Map(materials.map(m => [m.mm_material, m.mm_purchase_price_cents]))
        total_value_cents = inventoryRows.reduce((acc: number, inv: any) => {
          const price = materialMap.get(inv.mm_material) || 0
          return acc + (Number(inv.on_hand_qty) * Number(price))
        }, 0)
      }
    }

    // ✅ CORREÇÃO: Contar movimentações de hoje
    const today = new Date().toISOString().split('T')[0]
    const { data: todayMovements, error: moveError } = await s
      .from('wh_inventory_ledger')
      .select('ledger_id')
      .eq('tenant_id', TENANT)
      .gte('created_at', today)

    const today_moves = moveError ? 0 : (todayMovements?.length || 0)

    // ✅ CORREÇÃO: Calcular baixo estoque (regra: < 10 unidades)
    const low_stock = inventoryRows.filter((r: any) => Number(r.on_hand_qty) < 10).length

    return NextResponse.json({
      ok: true,
      data: { total_items, low_stock, today_moves, total_value_cents }
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: String(e?.message ?? e) } }, { status: 500 })
  }
}
