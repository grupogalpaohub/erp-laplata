import { NextResponse } from 'next/server'
import { supabaseServer } from '@/utils/supabase/server'

const TENANT = 'LaplataLunaria'

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth?.user) return NextResponse.json({ ok: false, error: 'UNAUTHENTICATED' }, { status: 401 })

    const body = await req.json().catch(() => ({} as any))
    const mm_desc = (body?.mm_desc ?? '').toString().trim()
    let mm_material = (body?.mm_material ?? '').toString().trim()

    if (!mm_desc) return NextResponse.json({ ok: false, error: 'Campo mm_desc é obrigatório.' }, { status: 400 })

    // gera código se não vier pronto
    if (!mm_material) {
      const { data: doc, error: docErr } = await supabase.rpc('next_doc_number', {
        p_tenant_id: TENANT,
        p_doc_type : 'MAT',
      })
      if (docErr || !doc) {
        return NextResponse.json({
          ok: false,
          error: `doc_numbering ausente/inativo para (${TENANT}).(MAT)`
        }, { status: 409 })
      }
      mm_material = String(doc)
    }

    const { error: insErr } = await supabase
      .from('mm_material')
      .insert([{ tenant_id: TENANT, mm_material, mm_desc, created_at: new Date().toISOString() }])

    if (insErr) return NextResponse.json({ ok: false, error: insErr.message }, { status: 400 })
    return NextResponse.json({ ok: true, mm_material }, { status: 201 })
  } catch {
    return NextResponse.json({ ok: false, error: 'Erro inesperado ao criar material.' }, { status: 500 })
  }
}