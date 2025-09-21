import { NextRequest, NextResponse } from 'next/server';

export const config = {
  // NÃO interceptar _next, assets, public, favicon, api
  matcher: ['/((?!_next|assets|public|favicon.ico|api).*)'],
};

const PUBLIC = new Set(['/', '/login', '/auth/callback', '/auth/callback/hash']);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC.has(pathname)) return NextResponse.next();

  // check leve por cookies da sessão Supabase
  const hasSession =
    req.cookies.has('sb-access-token') ||
    req.cookies.has('sb:token') ||
    req.cookies.has('supabase-auth-token');

  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    // RELATIVO ao mesmo host
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}