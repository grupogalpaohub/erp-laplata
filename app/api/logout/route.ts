export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/src/lib/supabase/server'
import { siteUrl } from '@/src/lib/env'

async function doSignOut() {
  const supabase = createServerClient({ cookies })
  try { await supabase.auth.signOut() } catch {}
}

export async function POST() {
  await doSignOut()
  const to = new URL('/login', siteUrl())
  return NextResponse.redirect(to, { status: 303 })
}

export async function GET() {
  // Suporte a GET porque o Next pode pré-buscar ou o link pode usar href
  return POST()
}
