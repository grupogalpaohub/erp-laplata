import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const PUBLIC_PATHS = new Set<string>([
  '/', '/login', '/auth/callback', '/favicon.ico'
])

// cookies possíveis do Supabase (v2, v1 e helpers antigos)
const TOKEN_COOKIES = [
  'sb-access-token',
  'sb-refresh-token',
  'sb:token',
  'supabase-auth-token', // legacy (às vezes é JSON/array)
]

function hasSupabaseSession(req: NextRequest): boolean {
  // se existir QUALQUER um dos cookies acima, consideramos autenticado
  for (const name of TOKEN_COOKIES) {
    const v = req.cookies.get(name)?.value
    if (v && v !== '[]') return true
  }
  return false
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  // rotas públicas liberadas
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next()

  // pular assets e API (Edge-safe)
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/public') ||
    pathname.startsWith('/api')
  ) return NextResponse.next()

  // precisa estar logado para o restante
  const ok = hasSupabaseSession(req)
  if (ok) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.search = `?next=${encodeURIComponent(pathname + (search || ''))}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|public|api).*)'],
}