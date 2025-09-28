import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST() {
  const supabase = supabaseServer()
  const { data, error } = await supabase.auth.refreshSession()

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 401 })
  return NextResponse.json({ ok: true, session: data.session })
}
