// app/auth/callback/route.ts
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const next = url.searchParams.get('next') || '/'

  console.log('[auth] Callback received:', { code: !!code, error, next })

  if (error) {
    console.error('[auth] OAuth callback error:', error)
    const res = NextResponse.redirect(new URL('/login?error=' + error, url.origin))
    return res
  }
  
  if (!code) {
    console.warn('[auth] OAuth callback sem "code"')
    const res = NextResponse.redirect(new URL('/login?error=missing_code', url.origin))
    return res
  }

  // Cria client com controle de cookies explícito
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { 
          const value = req.cookies.get(name)?.value
          console.log('[auth] Cookie get:', { name, hasValue: !!value })
          return value 
        },
        set(name: string, value: string, options: any) {
          const secure = process.env.NODE_ENV === 'production'
          const cookieOptions = {
            ...options,
            path: '/',
            httpOnly: true,
            sameSite: 'lax' as const,
            secure,
            maxAge: 60 * 60 * 24 * 7, // 7 dias
          }
          console.log('[auth] Cookie set:', { name, hasValue: !!value, options: cookieOptions })
          res.cookies.set(name, value, cookieOptions)
        },
        remove(name: string, options: any) {
          console.log('[auth] Cookie remove:', { name })
          res.cookies.set(name, '', { 
            ...options, 
            path: '/', 
            expires: new Date(0),
            httpOnly: true,
            sameSite: 'lax' as const,
            secure: process.env.NODE_ENV === 'production'
          })
        },
      },
    }
  )

  const { data, error: exErr } = await supabase.auth.exchangeCodeForSession(code)

  if (exErr) {
    console.error('[auth] exchangeCodeForSession falhou:', exErr)
    const res = NextResponse.redirect(new URL('/login?error=exchange_failed', url.origin))
    return res
  }

  console.log('[auth] Session exchange successful:', {
    hasUser: !!data.user,
    hasSession: !!data.session,
    userId: data.user?.id,
    sessionExpires: data.session?.expires_at
  })

  const res = NextResponse.redirect(new URL(next, url.origin))

  // Força definição de cookies de sessão
  if (data.session) {
    const projectRef = 'gpjcfwjssfvqhppxdudp'
    const secure = process.env.NODE_ENV === 'production'
    
    // Cookie de auth token
    res.cookies.set(`sb-${projectRef}-auth-token`, data.session.access_token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure,
      maxAge: 60 * 60 * 24 * 7
    })
    
    // Cookie de refresh token
    if (data.session.refresh_token) {
      res.cookies.set(`sb-${projectRef}-refresh-token`, data.session.refresh_token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure,
        maxAge: 60 * 60 * 24 * 30 // 30 dias
      })
    }
    
    console.log('[auth] Forced cookie setting completed')
  }

  return res
}