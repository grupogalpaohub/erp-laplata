// app/auth/callback/route.ts
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const next = url.searchParams.get('next') || '/'

  const res = NextResponse.redirect(new URL(next, url.origin))

  if (error) {
    console.error('[auth] OAuth callback error:', error)
    res.cookies.set('auth_error', error, { path: '/', httpOnly: false })
    return res
  }
  if (!code) {
    console.warn('[auth] OAuth callback sem "code"')
    return res
  }

  // Cria client com controle de cookies explícito
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return req.cookies.get(name)?.value },
        set(name: string, value: string, options: any) {
          const secure = process.env.NODE_ENV === 'production'
          res.cookies.set(name, value, {
            ...options,
            path: '/',            // <- crítico
            httpOnly: true,       // <- crítico
            sameSite: 'lax',      // <- crítico
            secure,               // <- crítico
          })
        },
        remove(name: string, options: any) {
          res.cookies.set(name, '', { ...options, path: '/', expires: new Date(0) })
        },
      },
    }
  )

  const { data, error: exErr } = await supabase.auth.exchangeCodeForSession(code)

  if (exErr) {
    console.error('[auth] exchangeCodeForSession falhou:', exErr)
    res.cookies.set('auth_error', exErr.message, { path: '/', httpOnly: false })
    return res
  }

  console.log('[auth] session OK (user id):', data.session?.user.id)
  return res
}