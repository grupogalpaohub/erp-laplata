import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
    // ✅ GUARDRAIL COMPLIANCE: API usando supabaseServer() helper
    const supabase = supabaseServer()
    
    // Tenant fixo conforme guardrails
    const TENANT_ID = "LaplataLunaria"
    
    // Buscar parâmetros de query
    const { searchParams } = new URL(req.url)
    const mm_order = searchParams.get('mm_order')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    
    // Construir query base
    let query = supabase
      .from('mm_purchase_order_item')
      .select('*', { count: 'exact' })
      .eq('tenant_id', TENANT_ID)
    
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
    // ✅ GUARDRAIL COMPLIANCE: API usando supabaseServer() helper
    const supabase = supabaseServer()
    
    // Tenant fixo conforme guardrails
    const TENANT_ID = "LaplataLunaria"
    
    const body = await req.json()
    
    // Validar campos obrigatórios conforme db_contract.json
    if (!body.mm_order || !body.plant_id || !body.mm_material || !body.mm_qtt || !body.unit_cost_cents) {
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: 'MISSING_REQUIRED_FIELDS', 
          message: 'mm_order, plant_id, mm_material, mm_qtt e unit_cost_cents são obrigatórios' 
        } 
      }, { status: 400 })
    }
    
    // Converter tipos numéricos se necessário
    const mm_qtt = typeof body.mm_qtt === 'string' ? parseFloat(body.mm_qtt) : body.mm_qtt
    const unit_cost_cents = typeof body.unit_cost_cents === 'string' ? parseInt(body.unit_cost_cents) : body.unit_cost_cents
    
    // Calcular line_total_cents
    const line_total_cents = Math.round(mm_qtt * unit_cost_cents)
    
    // Preparar dados para inserção - ✅ GUARDRAIL COMPLIANCE: Campos conforme db_contract.json
    const itemData: any = {
      tenant_id: TENANT_ID,
      mm_order: body.mm_order,
      plant_id: body.plant_id, // Obrigatório - sempre enviar (WH-001 ou selecionado)
      mm_material: body.mm_material,
      mm_qtt: mm_qtt,
      unit_cost_cents: unit_cost_cents,
      line_total_cents: line_total_cents,
      notes: body.notes || null,
      currency: body.currency || 'BRL',
      freeze_item_price: body.freeze_item_price || false,
      // po_item_id será gerado automaticamente pelo serial
    }
    
    // Só incluir quantity se for fornecido explicitamente
    if (body.quantity !== undefined && body.quantity !== null) {
      itemData.quantity = typeof body.quantity === 'string' ? parseFloat(body.quantity) : body.quantity
    }
    
    const { data, error } = await supabase
      .from('mm_purchase_order_item')
      .insert(itemData)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao criar purchase order item:', error)
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
      data 
    }, { status: 201 })
    
  } catch (error) {
    console.error('Erro inesperado na API purchase order items POST:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'Erro interno do servidor' 
      } 
    }, { status: 500 })
  }
}