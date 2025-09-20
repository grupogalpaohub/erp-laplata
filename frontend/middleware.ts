import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const PUBLIC_PATHS = new Set<string>([
  '/',
  '/login',
  '/auth/callback',
  '/auth/callback/hash',
  '/favicon.ico',
])

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

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
  const hasSession =
    req.cookies.has('sb-access-token') ||
    req.cookies.has('sb:token') ||
    req.cookies.has('supabase-auth-token')

  if (!hasSession) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname + (search || ''))
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|public|api).*)'],
}