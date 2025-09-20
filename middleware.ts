import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const PUBLIC_PATHS = new Set<string>(['/', '/login', '/auth/callback', '/favicon.ico'])

function hasSupabaseSession(req: NextRequest): boolean {
  const all = req.cookies.getAll()

  // 1) Cookies explícitos conhecidos
  for (const name of [
    'sb-access-token',
    'sb-refresh-token',
    'sb:token',
    'supabase-auth-token', // legacy (JSON: ["access","refresh"])
  ]) {
    const v = req.cookies.get(name)?.value
    if (v && v !== '[]') return true
  }

  // 2) Formato novo: sb-<project-ref>-auth-token (JSON: ["access","refresh"])
  const hasDynamic = all.some(c =>
    /^sb-[a-z0-9]{10,}-auth-token$/i.test(c.name) && c.value && c.value !== '[]'
  )
  if (hasDynamic) return true

  return false
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  // liberar rotas públicas
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next()

  // liberar assets e APIs
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/public') ||
    pathname.startsWith('/api')
  ) return NextResponse.next()

  // precisa sessão
  if (hasSupabaseSession(req)) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.search = `?next=${encodeURIComponent(pathname + (search || ''))}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|public|api).*)'],
}