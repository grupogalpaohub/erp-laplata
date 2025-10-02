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
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const q = searchParams.get('q') || ''
    const status = searchParams.get('status') || ''
    
    // Construir query base
    let query = supabase
      .from('mm_purchase_order')
      .select('*', { count: 'exact' })
      .eq('tenant_id', TENANT_ID)
    
    // Aplicar filtros
    if (q) {
      query = query.or(`mm_order.ilike.%${q}%,notes.ilike.%${q}%`)
    }
    
    if (status) {
      query = query.eq('status', status)
    }
    
    // Aplicar paginação
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    
    query = query.range(from, to).order('created_at', { ascending: false })
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Erro ao buscar purchase orders:', error)
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
    console.error('Erro inesperado na API purchase orders:', error)
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
    
    // Validar campos obrigatórios
    if (!body.vendor_id) {
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: 'MISSING_VENDOR_ID', 
          message: 'vendor_id é obrigatório' 
        } 
      }, { status: 400 })
    }
    
    // Preparar dados para inserção - ✅ GUARDRAIL COMPLIANCE: Campos conforme db_contract.json
    const poData = {
      tenant_id: TENANT_ID,
      mm_order: body.mm_order || null, // Será gerado pelo trigger se não fornecido
      vendor_id: body.vendor_id,
      order_date: body.order_date || new Date().toISOString().split('T')[0],
      status: body.status || 'draft',
      po_date: body.po_date || new Date().toISOString().split('T')[0],
      expected_delivery: body.expected_delivery || null,
      notes: body.notes || null,
      total_amount: body.total_amount || 0,
      currency: body.currency || 'BRL',
      total_cents: body.total_cents || 0,
    }
    
    const { data, error } = await supabase
      .from('mm_purchase_order')
      .insert(poData)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao criar purchase order:', error)
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
    console.error('Erro inesperado na API purchase orders POST:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'Erro interno do servidor' 
      } 
    }, { status: 500 })
  }
}
