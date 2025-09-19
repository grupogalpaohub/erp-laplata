import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_ROUTES = new Set<string>([
  '/login',
  '/auth/callback',
  '/favicon.ico',
  '/robots.txt',
])

export async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const path = url.pathname

  // permitir estáticos e as rotas públicas
  if (
    path.startsWith('/_next') ||
    path.startsWith('/assets') ||
    path.startsWith('/public') ||
    PUBLIC_ROUTES.has(path)
  ) {
    return NextResponse.next()
  }

  // cria cliente com cookies do request
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({ name, value, ...options })
        },
        remove: (name, options) => {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data } = await supabase.auth.getSession()
  const session = data.session

  if (!session) {
    const login = new URL('/login', url.origin)
    login.searchParams.set('next', path || '/')
    return NextResponse.redirect(login)
  }

  return res
}

export const config = {
  matcher: [
    // protege tudo, exceto arquivos estáticos e as rotas definidas acima
    '/((?!_next|assets|public).*)',
  ],
}