import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!_next|assets|public|favicon.ico).*)'],
};

const PUBLIC = new Set(['/', '/login', '/auth/callback', '/auth/callback/hash', '/landing']);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Permitir assets e arquivos estáticos
  if (pathname.startsWith('/_next') || pathname.startsWith('/assets') || pathname.startsWith('/public')) {
    return NextResponse.next();
  }
  
  // Permitir rotas públicas
  if (PUBLIC.has(pathname)) return NextResponse.next();
  
  // Permitir APIs
  if (pathname.startsWith('/api/')) return NextResponse.next();

  // Verificar se tem sessão (cookies de autenticação)
  const hasSession =
    req.cookies.has('sb-access-token') ||
    req.cookies.has('sb:token') ||
    req.cookies.has('supabase-auth-token') ||
    req.cookies.has('sb-gpjcfwjssfvqhppxdudp-auth-token');

  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}
