export const runtime = 'nodejs'

import { NextResponse, type NextRequest } from 'next/server'
import { supabaseServer } from '@/src/lib/supabase/server'
import { siteUrl } from '@/src/lib/env'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') || '/'

  const err = url.searchParams.get('error')
  if (err) {
    const to = new URL('/login', siteUrl())
    to.searchParams.set('error', err)
    return NextResponse.redirect(to, { status: 303 })
  }

  if (!code) {
    const to = new URL('/login', siteUrl())
    to.searchParams.set('error', 'missing_code')
    return NextResponse.redirect(to, { status: 303 })
  }

  const supabase = supabaseServer()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    const to = new URL('/login', siteUrl())
    to.searchParams.set('error', 'exchange_failed')
    return NextResponse.redirect(to, { status: 303 })
  }

  const to = new URL(next.startsWith('/') ? next : '/', siteUrl())
  return NextResponse.redirect(to, { status: 303 })
}