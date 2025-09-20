export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { siteUrl } from '@/src/lib/env'
import { supabaseServer } from '@/src/lib/supabase/server'

async function doSignOut() {
  const supabase = supabaseServer()
  try { await supabase.auth.signOut() } catch {}
}

export async function POST() {
  await doSignOut()
  const to = new URL('/login', siteUrl())
  return NextResponse.redirect(to, { status: 303 })
}
export async function GET() { return POST() }
