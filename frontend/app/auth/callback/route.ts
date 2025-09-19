import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/'

  if (!code) {
    // também cobre quando o provedor retorna tokens no fragmento (#)
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, request.url))
  }

  const supabase = supabaseServer()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('OAuth exchange error:', error.message)
    return NextResponse.redirect(new URL(`/login?error=oauth_exchange&next=${encodeURIComponent(next)}`, request.url))
  }

  return NextResponse.redirect(new URL(next, request.url))
}