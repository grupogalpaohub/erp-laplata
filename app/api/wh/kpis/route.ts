import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET() {
  try {
    const TENANT = 'LaplataLunaria' // LOCAL
    const s = supabaseServer()

    // lê inventário
    const { data, error } = await s
      .from('wh_inventory_balance')
      .select('mm_material,on_hand_qty,reserved_qty,status')
      .eq('tenant_id', TENANT)

    if (error) {
      return NextResponse.json({ ok: false, error: { code: error.code, message: error.message } }, { status: 500 })
    }

    const rows = data ?? []

    const total_items = rows.filter((r: any) => Number(r.on_hand_qty) > 0).length
    // manter low_stock como 0 até plugarmos a regra real (não inventar)
    const low_stock = 0
    const today_moves = 0
    // por ora não calculamos valor (sem custo confiável plugado)
    const total_value_cents = 0

    return NextResponse.json({
      ok: true,
      data: { total_items, low_stock, today_moves, total_value_cents }
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: String(e?.message ?? e) } }, { status: 500 })
  }
}
