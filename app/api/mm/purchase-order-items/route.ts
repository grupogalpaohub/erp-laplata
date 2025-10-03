import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'

const BodySchema = z.object({
  mm_order: z.string().min(1),            // chave do cabeçalho (PK)
  mm_material: z.string().min(1),
  mm_qtt: z.union([z.number(), z.string()]),
  unit_cost_cents: z.number().int().nonnegative(),
  plant_id: z.string().min(1),            // OBRIGATÓRIO - NOT NULL no banco
  notes: z.string().optional().default('')
})

export async function GET(req: Request) {
  try {
    // ✅ GUARDRAIL COMPLIANCE: API usando supabaseServer() helper
    const supabase = supabaseServer()
    
    // GUARDRAIL: Verificar autenticação via supabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({
        ok: false,
        error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado' }
      }, { status: 401 })
    }
    
    // Buscar parâmetros de query
    const { searchParams } = new URL(req.url)
    const mm_order = searchParams.get('mm_order')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    
    // Construir query base - RLS filtra automaticamente por tenant_id
    let query = supabase
      .from('mm_purchase_order_item')
      .select('*', { count: 'exact' })
    
    // Filtrar por order se fornecido
    if (mm_order) {
      query = query.eq('mm_order', mm_order)
    }
    
    // Aplicar paginação
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    
    query = query.range(from, to).order('po_item_id', { ascending: true })
    
    const { data, error, count } = await query
    
    if (error) {
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: (error as any).code, 
          message: error.message 
        } 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      ok: true, 
      data: data || [], 
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    })
    
  } catch (error) {
    return NextResponse.json({ 
      ok: false, 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'Erro interno do servidor' 
      } 
    }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer()

    // 1) User + tenant do JWT
    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr || !user) {
      return NextResponse.json({ ok:false, error:{ message:'Unauthorized' } }, { status:401 })
    }
    const tenant_id = await requireTenantId()

    // 2) Validar payload (sem tenant_id)
    const payload = await req.json()
    const parsed = BodySchema.safeParse(payload)
    if (!parsed.success) {
      return NextResponse.json({ ok:false, error:{ message:'Payload inválido', details: parsed.error.flatten() } }, { status:400 })
    }
    const { mm_order, mm_material, mm_qtt, unit_cost_cents, plant_id, notes } = parsed.data
    const quantity = Number(mm_qtt)
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return NextResponse.json({ ok:false, error:{ message:'Quantidade inválida' } }, { status:400 })
    }

    // 3) Validar cabeçalho (mesmo tenant + status draft) - RLS filtra automaticamente
    const { data: po, error: poErr } = await supabase
      .from('mm_purchase_order')
      .select('mm_order, status')
      .eq('mm_order', mm_order)
      .single()

    if (poErr || !po) {
      return NextResponse.json({ ok:false, error:{ message:'PO não encontrado ou sem permissão' } }, { status:404 })
    }
    if (po.status !== 'draft') {
      return NextResponse.json({ ok:false, error:{ message:'Somente PO em "draft" pode receber itens' } }, { status:409 })
    }

    // 4) Totais em centavos (sem hacks)
    const line_total_cents = Math.round(unit_cost_cents * quantity)

    // 5) Inserir item na tabela base, incluindo tenant_id e mm_order
    const insertPayload = {
      tenant_id,
      mm_order,
      mm_material,
      mm_qtt: quantity,
      unit_cost_cents,
      line_total_cents,
      plant_id,
      notes
    }

    const { data: ins, error: insErr } = await supabase
      .from('mm_purchase_order_item')
      .insert(insertPayload)
      .select('*')
      .single()

    if (insErr) {
      return NextResponse.json({ ok:false, error:{ message:'Falha ao inserir item', code: insErr.code, details: insErr.message } }, { status:500 })
    }

    return NextResponse.json({ ok:true, data: ins }, { status:201 })
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:{ message: e?.message ?? 'Erro inesperado' } }, { status:500 })
  }
}

export async function DELETE(req: Request) {
  try {
    // ✅ GUARDRAIL COMPLIANCE: API usando supabaseServer() helper
    const supabase = supabaseServer()
    
    // GUARDRAIL: Verificar autenticação via supabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({
        ok: false,
        error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado' }
      }, { status: 401 })
    }
    
    // Buscar parâmetros de query
    const { searchParams } = new URL(req.url)
    const mm_order = searchParams.get('mm_order')
    
    if (!mm_order) {
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: 'MISSING_MM_ORDER', 
          message: 'mm_order é obrigatório' 
        } 
      }, { status: 400 })
    }
    
    // Deletar todos os itens do pedido - RLS filtra automaticamente por tenant_id
    const { error } = await supabase
      .from('mm_purchase_order_item')
      .delete()
      .eq('mm_order', mm_order)
    
    if (error) {
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: (error as any).code, 
          message: error.message 
        } 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      ok: true, 
      data: { deleted: true }
    }, { status: 200 })
    
  } catch (error) {
    return NextResponse.json({ 
      ok: false, 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'Erro interno do servidor' 
      } 
    }, { status: 500 })
  }
}
