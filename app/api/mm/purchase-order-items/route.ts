import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseServer } from '@/lib/supabase/server'
import { toCents } from '@/lib/money'

// Schema do payload vindo do client (SEM tenant_id)
const BodySchema = z.object({
  mm_order: z.string().min(1),              // coluna do vínculo do item
  mm_material: z.string().min(1),
  mm_qtt: z.union([z.number(), z.string()]).refine((v) => String(v).trim() !== ''),
  unit_cost_cents: z.number().int().nonnegative(),
  plant_id: z.string().min(1).optional(),
  notes: z.string().optional(),
  currency: z.string().optional(),
  freeze_item_price: z.boolean().optional()
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
      console.error('Erro ao buscar purchase order items:', error)
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
    console.error('Erro inesperado na API purchase order items:', error)
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

    // 1) Autenticação + tenant_id do JWT (server-side)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ ok: false, error: { message: 'Unauthorized' } }, { status: 401 })
    }
    const tenant_id = user.user_metadata?.tenant_id
    if (!tenant_id) {
      return NextResponse.json({ ok: false, error: { message: 'Tenant inválido' } }, { status: 403 })
    }

    // 2) Payload SEM tenant_id
    const json = await req.json()
    const parsed = BodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: { message: 'Payload inválido', details: parsed.error.flatten() } }, { status: 400 })
    }
    const { mm_order, mm_material, mm_qtt, unit_cost_cents, plant_id, notes, currency, freeze_item_price } = parsed.data
    const qtt = Number(mm_qtt) // quantidade: UI pode mandar string

    // 3) Validar PO (mesmo tenant e status permitido)
    const { data: po, error: poError } = await supabase
      .from('mm_purchase_order')
      .select('mm_order, status')
      .eq('tenant_id', tenant_id)
      .eq('mm_order', mm_order)
      .single()

    if (poError || !po) {
      return NextResponse.json({ ok: false, error: { message: 'PO não encontrado ou sem permissão' } }, { status: 404 })
    }
    if (po.status !== 'draft') {
      return NextResponse.json({ ok: false, error: { message: 'Só é permitido incluir itens em PO com status "draft"' } }, { status: 409 })
    }

    // 4) Não precisamos calcular row_no - a tabela não tem essa coluna
    // O po_item_id é gerado automaticamente pelo serial

    // 5) Calcular total (centavos) — sem hacks de dinheiro
    const line_total_cents = Math.round(unit_cost_cents * qtt)

    // 6) INSERT com tenant_id (exigência da RLS no INSERT)
    const insertPayload: any = {
      tenant_id,
      mm_order,
      mm_material,
      unit_cost_cents,
      line_total_cents,
      mm_qtt: String(qtt),
      plant_id: plant_id || 'WH-001',
      notes: notes || null,
      currency: currency || 'BRL',
      freeze_item_price: freeze_item_price || false
    }

    const { data: ins, error: insError } = await supabase
      .from('mm_purchase_order_item')
      .insert(insertPayload)
      .select('mm_order, po_item_id, mm_material, unit_cost_cents, line_total_cents')
      .single()

    if (insError) {
      // 42501 = RLS bloqueou. Tipicamente: faltou tenant_id OU coluna-vínculo errada.
      return NextResponse.json({ ok: false, error: { message: 'Falha ao inserir item', details: insError.message, code: insError.code } }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data: ins }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e?.message ?? 'Erro inesperado' } }, { status: 500 })
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
      console.error('Erro ao deletar purchase order items:', error)
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
    console.error('Erro inesperado na API purchase order items DELETE:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'Erro interno do servidor' 
      } 
    }, { status: 500 })
  }
}
