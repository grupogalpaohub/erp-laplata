export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') || '/'
  const res = NextResponse.redirect(new URL(next, url.origin))

  if (!code) {
    console.warn('[auth/callback] sem code')
    return res
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          const secure = process.env.NODE_ENV === 'production'
          res.cookies.set(name, value, {
            ...options,
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure,
          })
        },
        remove: (name, options) => {
          res.cookies.set(name, '', { ...options, path: '/', expires: new Date(0) })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    console.error('[auth/callback] exchange error:', error.message)
    res.cookies.set('auth_error', error.message, { path: '/', httpOnly: false })
  } else {
    console.log('[auth/callback] session OK user=', data.session?.user.id)
  }
  return res
}