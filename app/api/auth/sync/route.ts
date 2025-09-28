import { NextResponse } from 'next/server'
import { supabaseServer } from '@/utils/supabase/server'

export async function POST() {
  const supabase = supabaseServer()
  const { data, error } = await supabase.auth.getSession()

  if (error) return NextResponse.json({ error: error.message }, { status: 401 })
  return NextResponse.json({ session: data.session })
}
