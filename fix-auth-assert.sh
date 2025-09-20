set -euo pipefail

cd frontend

# 1) Callback — garante cookies bons
mkdir -p app/auth/callback
cat > app/auth/callback/route.ts <<'TS'
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
TS

# 2) Middleware — leitura oficial c/ @supabase/ssr (idempotente)
cat > middleware.ts <<'TS'
import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/ssr'

const PUBLIC = new Set(['/', '/login', '/auth/callback', '/favicon.ico'])

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (
    PUBLIC.has(pathname) ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/public') ||
    pathname.startsWith('/api/_debug')
  ) {
    return NextResponse.next()
  }

  const res = NextResponse.next()
  const supabase = createMiddlewareClient(
    { req, res },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    // log mínimo pra sanity check (vai pro Vercel)
    console.log('[mw] ok user=', session.user.id, 'path=', pathname)
    return res
  }

  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.search = `?next=${encodeURIComponent(pathname + (req.nextUrl.search || ''))}`
  console.log('[mw] sem sessão -> redirecionando para', url.toString())
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|public).*)'],
}
TS

# 3) Login page — garante redirectTo pro seu callback com next
mkdir -p app/login
cat > app/login/page.tsx <<'TS'
'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

function siteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || ''
  if (!raw) return 'http://localhost:3000'
  return raw.startsWith('http') ? raw.replace(/\/+$/, '') : `https://${raw}`.replace(/\/+$/, '')
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const sp = useSearchParams()
  const next = sp.get('next') || '/'

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function signIn() {
    setLoading(true)
    const redirectTo = `${siteUrl()}/auth/callback?next=${encodeURIComponent(next)}`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, queryParams: { prompt: 'select_account' } },
    })
    if (error) {
      console.error('[login] OAuth error:', error.message)
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-md min-h-[60vh] flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Entrar</h1>
      <button
        type="button"
        onClick={signIn}
        disabled={loading}
        className="rounded-md border px-4 py-2 bg-fiori-accent text-white disabled:opacity-60"
      >
        Entrar com Google
      </button>
    </main>
  )
}
TS

# 4) Debug APIs
mkdir -p src/app/api/_debug/auth-status
cat > src/app/api/_debug/auth-status/route.ts <<'TS'
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient(
    { cookies: () => req.cookies },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }
  )
  const { data: { session } } = await supabase.auth.getSession()
  return NextResponse.json({ hasSession: !!session, userId: session?.user.id ?? null })
}
TS

mkdir -p src/app/api/_debug/cookies
cat > src/app/api/_debug/cookies/route.ts <<'TS'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export async function GET(req: NextRequest) {
  const cookies = req.cookies.getAll().filter(c => c.name.includes('sb-') || c.name.includes('auth'))
  return NextResponse.json({ cookies })
}
TS

# 5) WhoAmI (client) — pra ver no navegador se a sessão chega
mkdir -p app/whoami
cat > app/whoami/page.tsx <<'TS'
'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'
export default function WhoAmI() {
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    const s = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    s.auth.getUser().then(({ data }) => setUser(data.user ?? null))
  }, [])
  return <pre className="p-6">{JSON.stringify({ user }, null, 2)}</pre>
}
TS

# 6) .env.example alinhado
cat > .env.example <<'ENV'
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
# SUPABASE_SERVICE_ROLE_KEY=  # usar só em Edge/Server
ENV

echo "✅ Patch aplicado. Agora: npm run build"
