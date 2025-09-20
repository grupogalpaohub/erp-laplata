export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'  // evita cache do Next/Edge

import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { siteUrl } from '@/src/lib/env'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') || '/'

  console.log('Auth callback received:', { code: !!code, next, error: url.searchParams.get('error') })

  const err = url.searchParams.get('error')
  if (err || !code) {
    console.log('Auth callback error:', { err, hasCode: !!code })
    const to = new URL('/login', siteUrl())
    if (err) to.searchParams.set('error', err)
    if (!code) to.searchParams.set('error', 'missing_code')
    return NextResponse.redirect(to, { status: 303 })
  }

  const redirectTo = new URL(next.startsWith('/') ? next : '/', siteUrl())
  console.log('Auth callback redirecting to:', redirectTo.toString())
  const res = NextResponse.redirect(redirectTo, { status: 303 })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          res.cookies.set({ name, value, ...options })
        },
        remove: (name: string, options: any) => {
          res.cookies.set({ name, value: '', ...options, maxAge: 0 })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  
  if (error) {
    console.error('Auth exchange error:', error)
    const to = new URL('/login', siteUrl())
    to.searchParams.set('error', 'exchange_failed')
    return NextResponse.redirect(to, { status: 303 })
  }

  console.log('Auth exchange successful:', { 
    hasUser: !!data.user, 
    hasSession: !!data.session,
    userId: data.user?.id,
    sessionId: data.session?.access_token?.substring(0, 20) + '...'
  })
  
  // Log dos cookies que serão definidos
  console.log('Response cookies:', res.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value })))
  
  console.log('Redirecting to:', redirectTo.toString())
  return res
}