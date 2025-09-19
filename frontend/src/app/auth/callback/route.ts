import { NextResponse } from 'next/server'
import { supabaseServer } from '@/src/lib/supabase/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') || '/'

  if (code) {
    const supabase = await supabaseServer()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, url.origin))
    }
    return NextResponse.redirect(new URL(next, url.origin))
  }
  if (url.hash && url.hash.includes('access_token')) {
    return NextResponse.redirect(new URL(`/auth/callback/hash${url.hash}`, url.origin))
  }
  return NextResponse.redirect(new URL('/login', url.origin))
}
