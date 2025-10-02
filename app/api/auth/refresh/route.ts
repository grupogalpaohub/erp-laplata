import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST() {
  const supabase = supabaseServer()
  // força getSession() para repassar cookies httpOnly do SSR
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
  }
  return NextResponse.json({ ok: true, session: data.session ?? null })
}

