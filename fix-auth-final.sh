set -euo pipefail

if [ -d "frontend" ]; then cd frontend; fi

echo "==> 1) Dependências"
npm i @supabase/ssr -S

echo "==> 2) Helpers de env"
mkdir -p src/lib
cat > src/lib/env.ts <<'TS'
function stripTrailingSlash(u: string) { return u.replace(/\/+$/, '') }
export function siteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    ''
  if (!raw) return 'http://localhost:3000'
  const base = raw.startsWith('http') ? raw : `https://${raw}`
  return stripTrailingSlash(base)
}
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
TS

echo "==> 3) LOGIN com fallback de hash (#access_token)"
mkdir -p app/login
cat > app/login/page.tsx <<'TS'
'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { siteUrl } from '@/src/lib/env'

export default function LoginPage() {
  const sp = useSearchParams()
  const next = sp.get('next') || '/'
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Fallback para implicit flow (#access_token no hash)
  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.replace(/^#/, ''))
      const access_token = params.get('access_token') || ''
      const refresh_token = params.get('refresh_token') || ''
      const sb = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      if (access_token && refresh_token) {
        sb.auth.setSession({ access_token, refresh_token })
          .finally(() => router.replace(next))
      } else {
        router.replace(next)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function signIn() {
    setLoading(true)
    const sb = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const redirectTo = `${siteUrl()}/auth/callback?next=${encodeURIComponent(next)}`
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, queryParams: { prompt: 'select_account' } },
    })
    if (error) {
      console.error('[login] oauth error:', error.message)
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

echo "==> 4) CALLBACK (route) com cookies corretos"
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

  if (!code) return res

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

echo "==> 5) CALLBACK (page) fallback de hash (opcional, segura)"
cat > app/auth/callback/page.tsx <<'TS'
'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
export default function OAuthHashFallback() {
  const router = useRouter()
  const sp = useSearchParams()
  const next = sp.get('next') || '/'
  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    if (!hash?.includes('access_token')) { router.replace(next); return }
    const params = new URLSearchParams(hash.replace(/^#/, ''))
    const access_token = params.get('access_token') || ''
    const refresh_token = params.get('refresh_token') || ''
    const sb = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    if (access_token && refresh_token) {
      sb.auth.setSession({ access_token, refresh_token })
        .finally(() => router.replace(next))
    } else {
      router.replace(next)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
TS

echo "==> 6) Middleware lendo sessão oficial"
cat > middleware.ts <<'TS'
import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/ssr'
const PUBLIC = new Set(['/', '/login', '/auth/callback', '/favicon.ico'])
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (PUBLIC.has(pathname) ||
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/assets') ||
      pathname.startsWith('/public') ||
      pathname.startsWith('/api/_debug')) {
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
  if (session) return res
  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.search = `?next=${encodeURIComponent(pathname + (req.nextUrl.search || ''))}`
  return NextResponse.redirect(url)
}
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|public).*)'],
}
TS

echo "==> 7) Endpoints de DEBUG (em src/app/api/_debug/*)"
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

echo "==> 8) WhoAmI (client) para validar user"
mkdir -p app/whoami
cat > app/whoami/page.tsx <<'TS'
'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
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

echo "==> 9) .env.example alinhado"
cat > .env.example <<'ENV'
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
# SUPABASE_SERVICE_ROLE_KEY=   # usar só em Edge/Server
ENV

echo "==> 10) Build"
npm run build

echo "✅ Pronto. Commit & push!"
