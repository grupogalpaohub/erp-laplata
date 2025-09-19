#!/usr/bin/env bash
set -euo pipefail

echo "==> 1) Garantir que as rotas estão em frontend/app (Next lê aqui)"
mkdir -p frontend/app/{auth/callback,api/logout,login,mm/catalog}

[ -f frontend/src/app/auth/callback/route.ts ] && mv -f frontend/src/app/auth/callback/route.ts frontend/app/auth/callback/route.ts || true
[ -f frontend/src/app/api/logout/route.ts ]     && mv -f frontend/src/app/api/logout/route.ts     frontend/app/api/logout/route.ts     || true
[ -f frontend/src/app/login/page.tsx ]          && mv -f frontend/src/app/login/page.tsx          frontend/app/login/page.tsx          || true
[ -f frontend/src/app/mm/catalog/page.tsx ]     && mv -f frontend/src/app/mm/catalog/page.tsx     frontend/app/mm/catalog/page.tsx     || true

echo "==> 2) Middleware na raiz do frontend (Edge)"
[ -f frontend/src/middleware.ts ] && mv -f frontend/src/middleware.ts frontend/middleware.ts || true

echo "==> 3) Callback OAuth com log explícito de erro"
cat > frontend/app/auth/callback/route.ts <<'TS'
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
TS

echo "==> 4) Fallback para casos de #access_token no fragment"
cat > frontend/app/auth/callback/page.tsx <<'TSX'
'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabaseBrowser } from '@/src/lib/supabase/client'

export default function OAuthHashFallback() {
  const router = useRouter()
  const sp = useSearchParams()

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    if (!hash?.includes('access_token')) {
      router.replace(sp.get('next') || '/')
      return
    }
    const params = new URLSearchParams(hash.replace(/^#/, ''))
    const access_token = params.get('access_token') || ''
    const refresh_token = params.get('refresh_token') || ''
    const expires_in = Number(params.get('expires_in') || '3600')

    if (access_token && refresh_token) {
      const sb = supabaseBrowser()
      sb.auth.setSession({ access_token, refresh_token })
        .finally(() => router.replace(sp.get('next') || '/'))
    } else {
      router.replace(sp.get('next') || '/')
    }
  }, [router, sp])

  return null
}
TSX

echo "==> 5) Endpoints de DEBUG (ver sessão em produção)"
mkdir -p frontend/app/api/_debug/auth-status

cat > frontend/app/api/_debug/auth-status/route.ts <<'TS'
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/src/lib/supabase/server'
export async function GET() {
  const sb = supabaseServer()
  const [user, session] = await Promise.all([
    sb.auth.getUser(),
    sb.auth.getSession()
  ])
  return NextResponse.json({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    user: user.data?.user ?? null,
    session: session.data?.session ? { expires_at: session.data.session.expires_at } : null
  })
}
TS

echo "==> 6) Middleware edge-safe (usa req/res cookies, SEM loops)"
cat > frontend/middleware.ts <<'TS'
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_PATHS = new Set(['/', '/login', '/auth/callback', '/favicon.ico'])

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (
    PUBLIC_PATHS.has(pathname) ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/public/') ||
    pathname.startsWith('/assets/')
  ) {
    return NextResponse.next()
  }

  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options: any) => res.cookies.set({ name, value, ...options }),
        remove: (name: string, options: any) => res.cookies.set({ name, value: '', ...options }),
      },
    }
  )

  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error('[MIDDLEWARE] getUser error:', error.message)
  }
  if (!data?.user) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname || '/')
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public|assets).*)'],
}
TS

echo "==> 7) Rebuild"
cd frontend
npm run build