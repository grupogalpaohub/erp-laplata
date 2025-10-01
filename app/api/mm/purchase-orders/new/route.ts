import { NextResponse } from 'next/server'
import { supabaseServer } from '@/utils/supabase/server'

export async function GET() {
  const supabase = supabaseServer()
  const { data, error } = await supabase
    .from('mm_purchase_order')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
  }
  return NextResponse.json({ ok: true, data })
}