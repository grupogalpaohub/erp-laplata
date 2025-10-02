import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET() {
  const s = supabaseServer()
  const { data, error } = await s
    .from('crm_customer')
    .select('customer_id, name, email, telefone, contact_phone, customer_type, created_date')
    .order('name', { ascending: true })

  if (error) {
    return NextResponse.json({ ok: false, error: { code: error.code, message: error.message } }, { status: 500 })
  }
  return NextResponse.json({ ok: true, data: data ?? [] }, { status: 200 })
}