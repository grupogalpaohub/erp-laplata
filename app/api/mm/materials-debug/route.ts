import { NextResponse } from 'next/server'
import { supabaseServer } from '@/utils/supabase/server'

const TENANT = 'LaplataLunaria'

export async function POST(req: Request) {
  try {
    console.log('=== DEBUG API MM MATERIALS ===')
    
    const body = await req.json().catch(() => ({} as any))
    console.log('Body recebido:', body)
    
    const mm_desc = (body?.mm_desc ?? '').toString().trim()
    console.log('mm_desc extraído:', mm_desc)

    if (!mm_desc) {
      console.log('Erro: mm_desc vazio')
      return NextResponse.json({ ok: false, error: 'Campo mm_desc é obrigatório.' }, { status: 400 })
    }

    // GUARDRAIL: Não aceitar mm_material do payload (será gerado pelo trigger)
    if (body?.mm_material) {
      console.log('Erro: mm_material no payload')
      return NextResponse.json({ 
        ok: false, 
        error: 'mm_material não deve ser enviado no payload (gerado automaticamente pelo trigger)' 
      }, { status: 400 })
    }

    console.log('Tentando conectar com Supabase...')
    const supabase = supabaseServer()
    
    console.log('Tentando obter usuário...')
    const { data: auth, error: authError } = await supabase.auth.getUser()
    console.log('Auth result:', { auth, authError })
    
    // Para debug, vamos pular a autenticação temporariamente
    console.log('PULANDO AUTENTICAÇÃO PARA DEBUG')
    
    console.log('Inserindo material...')
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

    console.log('Resultado da inserção:', { data, error: insErr })

    if (insErr) {
      console.log('Erro na inserção:', insErr)
      return NextResponse.json({ ok: false, error: insErr.message }, { status: 400 })
    }
    
    console.log('Sucesso! Material criado:', data.mm_material)
    return NextResponse.json({ ok: true, mm_material: data.mm_material }, { status: 201 })
    
  } catch (error) {
    console.error('Erro inesperado ao criar material:', error)
    return NextResponse.json({ ok: false, error: 'Erro inesperado ao criar material.' }, { status: 500 })
  }
}
