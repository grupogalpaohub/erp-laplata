import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET() {
  try {
    const s = supabaseServer()
    const { data, error } = await s
      .from('crm_customer')
      .select('customer_id, name, email, telefone, contact_phone, customer_type, created_date')
      .order('created_date', { ascending: false })

    if (error) {
      console.error('Supabase error in GET /api/crm/customers:', error)
      return NextResponse.json({ ok: false, error: { code: error.code, message: error.message } }, { status: 500 })
    }
    return NextResponse.json({ ok: true, data: data ?? [] }, { status: 200 })
  } catch (e: any) {
    console.error('Error in GET /api/crm/customers:', e)
    return NextResponse.json({ ok: false, error: { message: e?.message ?? 'Internal server error' } }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const customer_id = body.customer_id ?? `CUST-${Date.now()}`
    const created_date = body.created_date ?? new Date().toISOString().slice(0,10)

    // Somente colunas reais da tabela crm_customer
    const payload = {
      customer_id,
      name: body.name,
      email: body.email ?? null,
      telefone: body.telefone ?? null,
      contact_email: body.contact_email ?? null,
      contact_phone: body.contact_phone ?? null,
      customer_type: body.customer_type ?? 'PF',
      status: body.status ?? 'active',
      created_date,
      notes: body.notes ?? null,
      preferred_payment_method: body.preferred_payment_method ?? null,
      preferred_payment_terms: body.preferred_payment_terms ?? null,
      // Campos de endereço se fornecidos
      document_id: body.document_id ?? null,
      addr_street: body.addr_street ?? null,
      addr_number: body.addr_number ?? null,
      addr_complement: body.addr_complement ?? null,
      addr_district: body.addr_district ?? null,
      addr_city: body.addr_city ?? null,
      addr_state: body.addr_state ?? null,
      addr_zip: body.addr_zip ?? null,
      addr_country: body.addr_country ?? 'BR',
      phone_country: body.phone_country ?? 'BR',
      contact_name: body.contact_name ?? null,
      customer_category: body.customer_category ?? null,
      lead_classification: body.lead_classification ?? null,
      sales_channel: body.sales_channel ?? null,
      is_active: body.is_active ?? true,
    }

    // validação mínima
    if (!payload.name) {
      return NextResponse.json({ ok: false, error: { message: 'name is required' } }, { status: 400 })
    }

    const s = supabaseServer()
    const { data, error } = await s.from('crm_customer').insert(payload).select('customer_id').single()

    if (error) {
      return NextResponse.json({ ok: false, error: { code: error.code, message: error.message } }, { status: 500 })
    }

    return NextResponse.json({ ok: true, data }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: String(e?.message ?? e) } }, { status: 500 })
  }
}