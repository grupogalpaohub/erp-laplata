import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET() {
  const supabase = supabaseServer()
  const { data: u } = await supabase.auth.getUser()
  return NextResponse.json({ user: u?.user ?? null })
}
