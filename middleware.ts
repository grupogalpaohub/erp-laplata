import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|public|api).*)'],
}

const PUBLIC_PATHS = new Set<string>([
  '/',
  '/login',
  '/auth/callback',
  '/auth/callback/hash',
  '/favicon.ico',
])

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Liberar estáticos/ativos
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next()
  }

  // Liberar rotas públicas
  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next()
  }

  // Check leve por cookies (Edge-safe; sem Supabase/Node)
  // Verificar cookies do Supabase Auth - verificar todos os possíveis nomes
  const hasSession =
    req.cookies.has('sb-access-token') ||
    req.cookies.has('sb-refresh-token') ||
    req.cookies.has('sb-provider-token') ||
    req.cookies.has('supabase-auth-token') ||
    req.cookies.has('supabase.auth.token') ||
    req.cookies.has('sb:token') ||
    req.cookies.has('supabase.auth.refresh_token') ||
    req.cookies.has('supabase.auth.access_token')

  if (!hasSession) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}