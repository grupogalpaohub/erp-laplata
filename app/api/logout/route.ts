import { NextResponse } from 'next/server'
import { supabaseServer } from '@/utils/supabase/server'

export async function POST() {
  const sb = supabaseServer()
  await sb.auth.signOut()
  return NextResponse.json({ ok: true, message: 'Logged out successfully' })
}

export async function GET() {
  const sb = supabaseServer()
  await sb.auth.signOut()
  return NextResponse.redirect(new URL('/login', 'http://localhost:3000'))
}
