// middleware.ts — verificação robusta de cookies do Supabase
import { NextResponse, type NextRequest } from 'next/server'

// rotas públicas liberadas
const PUBLIC = new Set<string>(['/', '/login', '/auth/callback', '/favicon.ico'])

function hasValidSupabaseSession(req: NextRequest): boolean {
  const cookies = req.cookies.getAll()
  
  // Verifica cookies conhecidos do Supabase
  const knownCookies = [
    'sb-access-token',
    'sb-refresh-token', 
    'sb:token',
    'supabase-auth-token'
  ]
  
  for (const cookie of cookies) {
    // Cookies explícitos conhecidos
    if (knownCookies.includes(cookie.name) && cookie.value && cookie.value !== '[]') {
      return true
    }
    
    // Formato dinâmico: sb-<project-ref>-auth-token
    if (/^sb-[a-z0-9]{10,}-auth-token$/i.test(cookie.name) && cookie.value && cookie.value !== '[]') {
      return true
    }
    
    // Formato dinâmico: sb-<project-ref>-access-token
    if (/^sb-[a-z0-9]{10,}-access-token$/i.test(cookie.name) && cookie.value && cookie.value !== '[]') {
      return true
    }
  }
  
  return false
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // assets e APIs nunca passam por auth
  if (
    PUBLIC.has(pathname) ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/public') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next()
  }

  // Verifica se tem sessão válida do Supabase
  if (hasValidSupabaseSession(req)) {
    return NextResponse.next()
  }

  // sem sessão -> redireciona p/ login com ?next
  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.search = `?next=${encodeURIComponent(pathname + (req.nextUrl.search || ''))}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|public|api).*)'],
}