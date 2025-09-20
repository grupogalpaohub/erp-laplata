import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// ✅ Rotas públicas liberadas sem sessão
const PUBLIC_PATHS = new Set<string>([
  '/',
  '/login',
  '/auth/callback',
  '/auth/callback/hash',
  '/favicon.ico',
])

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  // ✅ Ignora assets e estáticos (sempre liberar)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next()
  }

  // ✅ Páginas públicas liberadas
  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next()
  }

  // ✅ Check leve baseado em cookies — compatível com Edge (sem Supabase/Node)
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

// Matcher padrão — não tente mudar runtime (middleware é sempre Edge)
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|public).*)'],
}