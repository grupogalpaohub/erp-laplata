export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') || '/'
  const error = url.searchParams.get('error')
  
  console.log('[auth/callback] START:', { 
    code: !!code, 
    next, 
    error,
    url: url.toString(),
    cookies: req.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value }))
  })

  // Se há erro do OAuth, redireciona para login com erro
  if (error) {
    console.error('[auth/callback] OAuth error:', error)
    const loginUrl = new URL('/login', url.origin)
    loginUrl.searchParams.set('error', error)
    return NextResponse.redirect(loginUrl)
  }

  if (!code) {
    console.warn('[auth/callback] sem code - redirecionando para login')
    const loginUrl = new URL('/login', url.origin)
    loginUrl.searchParams.set('error', 'missing_code')
    return NextResponse.redirect(loginUrl)
  }

  const res = NextResponse.redirect(new URL(next, url.origin))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => {
          const value = req.cookies.get(name)?.value
          console.log('[auth/callback] cookie get:', { name, hasValue: !!value })
          return value
        },
        set: (name, value, options) => {
          const secure = process.env.NODE_ENV === 'production'
          const cookieOptions = {
            ...options,
            path: '/',
            httpOnly: true,
            sameSite: 'lax' as const,
            secure,
          }
          console.log('[auth/callback] cookie set:', { name, hasValue: !!value, options: cookieOptions })
          res.cookies.set(name, value, cookieOptions)
        },
        remove: (name, options) => {
          console.log('[auth/callback] cookie remove:', { name })
          res.cookies.set(name, '', { ...options, path: '/', expires: new Date(0) })
        },
      },
    }
  )

  console.log('[auth/callback] tentando exchangeCodeForSession...')
  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
  
  if (exchangeError) {
    console.error('[auth/callback] exchange error:', {
      message: exchangeError.message,
      status: exchangeError.status,
      name: exchangeError.name
    })
    const loginUrl = new URL('/login', url.origin)
    loginUrl.searchParams.set('error', `exchange_failed: ${exchangeError.message}`)
    return NextResponse.redirect(loginUrl)
  }

  console.log('[auth/callback] exchange success:', {
    hasUser: !!data.user,
    hasSession: !!data.session,
    userId: data.user?.id,
    sessionExpires: data.session?.expires_at,
    cookiesAfter: res.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value }))
  })

  return res
}