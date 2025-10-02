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
    
    // Construir query base
    let query = supabase
      .from('crm_customer')
      .select('*', { count: 'exact' })
      .eq('tenant_id', TENANT_ID)
    
    // Aplicar filtro de busca se fornecido
    if (q) {
      query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,document_id.ilike.%${q}%`)
    }
    
    // Aplicar paginação
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    
    query = query.range(from, to).order('created_date', { ascending: false })
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Erro ao buscar customers:', error)
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
    console.error('Erro inesperado na API customers:', error)
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
    if (!body.name || !body.email) {
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: 'MISSING_REQUIRED_FIELDS', 
          message: 'Nome e email são obrigatórios' 
        } 
      }, { status: 400 })
    }
    
    // Preparar dados para inserção
    const customerData = {
      tenant_id: TENANT_ID,
      name: body.name,
      email: body.email,
      telefone: body.telefone || null,
      customer_type: body.customer_type || 'individual',
      status: body.status || 'active',
      customer_category: body.customer_category || null,
      lead_classification: body.lead_classification || null,
      sales_channel: body.sales_channel || null,
      notes: body.notes || null,
      preferred_payment_method: body.preferred_payment_method || null,
      preferred_payment_terms: body.preferred_payment_terms || null,
      contact_email: body.contact_email || body.email,
      contact_phone: body.contact_phone || body.telefone,
      phone_country: body.phone_country || 'BR',
      contact_name: body.contact_name || body.name,
      document_id: body.document_id || null,
      addr_street: body.addr_street || null,
      addr_number: body.addr_number || null,
      addr_complement: body.addr_complement || null,
      addr_district: body.addr_district || null,
      addr_city: body.addr_city || null,
      addr_state: body.addr_state || null,
      addr_zip: body.addr_zip || null,
      addr_country: body.addr_country || 'BR',
      is_active: body.is_active !== false, // default true
    }
    
    const { data, error } = await supabase
      .from('crm_customer')
      .insert(customerData)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao criar customer:', error)
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
    console.error('Erro inesperado na API customers POST:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'Erro interno do servidor' 
      } 
    }, { status: 500 })
  }
}