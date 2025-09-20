import { NextResponse } from 'next/server'
import { supabaseServer } from '@/src/lib/supabase/server'

export async function POST() {
  const sb = supabaseServer()
  await sb.auth.signOut()
  const base = process.env.NEXT_PUBLIC_SITE_URL || '/'
  return NextResponse.redirect(new URL('/', base))
}
