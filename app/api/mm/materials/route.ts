import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'

export async function GET(req: Request) {
  try {
    const supabase = supabaseServer()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth?.user) return NextResponse.json({ ok: false, error: 'UNAUTHENTICATED' }, { status: 401 })

    const url = new URL(req.url)
    const q = url.searchParams.get('q')?.trim() ?? ''
    const page = Number(url.searchParams.get('page') ?? 1)
    const pageSize = Math.min(Number(url.searchParams.get('pageSize') ?? 50), 200)
    
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('mm_material')
      .select('mm_material, mm_desc, commercial_name, mm_price_cents, mm_purchase_price_cents, unit_of_measure, status', { count: 'exact' })
      .eq('status', 'active')
      .order('mm_material')

    if (q) {
      query = query.or(`mm_material.ilike.%${q}%,mm_desc.ilike.%${q}%,commercial_name.ilike.%${q}%`)
    }

    const { data, count, error } = await query.range(from, to)

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })

    return NextResponse.json({ 
      ok: true, 
      materials: data || [], 
      total: count || 0, 
      page, 
      pageSize 
    })
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Erro inesperado ao buscar materiais.' }, { status: 500 })
  }
}

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

    // Obter tenant_id do usuário autenticado
    const tenant_id = await requireTenantId()

    // Inserir material - o trigger trg_mm_material_assign_id_bi gerará o mm_material automaticamente
    const { data, error: insErr } = await supabase
      .from('mm_material')
      .insert([{ 
        tenant_id, 
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
    return NextResponse.json({ ok: false, error: 'Erro inesperado ao criar material.' }, { status: 500 })
  }
}
