import { NextResponse } from 'next/server'
import { supabaseServer } from '@/src/lib/supabase/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') || '/'

  if (!code) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, request.url))
  }

  const supabase = supabaseServer()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    console.error('[AUTH] exchangeCodeForSession FAILED:', {
      message: error.message,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
    })
    return NextResponse.redirect(new URL(`/login?error=oauth_exchange&next=${encodeURIComponent(next)}`, request.url))
  }

  return NextResponse.redirect(new URL(next, request.url))
}
