import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

// Forçar Node.js runtime para APIs que usam Supabase
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const supabase = supabaseServer()
  const { data: u } = await supabase.auth.getUser()
  return NextResponse.json({ user: u?.user ?? null })
}
