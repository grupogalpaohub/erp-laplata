import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

const TENANT = 'LaplataLunaria'

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth?.user) return NextResponse.json({ ok: false, error: 'UNAUTHENTICATED' }, { status: 401 })

    const body = await req.json().catch(() => ({} as any))
    const mm_desc = (body?.mm_desc ?? '').toString().trim()

    if (!mm_desc) return NextResponse.json({ ok: false, error: 'Campo mm_desc é obrigatório.' }, { status: 400 })

    // GUARDRAIL: Não aceitar mm_material do payload (será gerado pelo trigger)
    if (body?.mm_material) {
      return NextResponse.json({ 
        ok: false, 
        error: 'mm_material não deve ser enviado no payload (gerado automaticamente pelo trigger)' 
      }, { status: 400 })
    }

    // Inserir material - o trigger trg_mm_material_assign_id_bi gerará o mm_material automaticamente
    const { data, error: insErr } = await supabase
      .from('mm_material')
      .insert([{ 
        tenant_id: TENANT, 
        mm_desc,
        // mm_material será gerado pelo trigger
        status: 'active',
        unit_of_measure: 'unidade',
        min_stock: 0,
        max_stock: 1000,
        lead_time_days: 7,
        mm_price_cents: 0,
        mm_purchase_price_cents: 0
      }])
      .select('mm_material')
      .single()

    if (insErr) return NextResponse.json({ ok: false, error: insErr.message }, { status: 400 })
    return NextResponse.json({ ok: true, mm_material: data.mm_material }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar material:', error)
    return NextResponse.json({ ok: false, error: 'Erro inesperado ao criar material.' }, { status: 500 })
  }
}