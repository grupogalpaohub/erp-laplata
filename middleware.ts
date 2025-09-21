import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/ssr';
import { ENV } from '@/lib/env';

export const config = {
  matcher: ['/((?!_next|assets|public|favicon.ico|api).*)'],
};

const PUBLIC = new Set(['/', '/login', '/auth/callback', '/auth/callback/hash']);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC.has(pathname)) return NextResponse.next();

  // cria response mutável para setar cookies se necessário
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({
    supabaseUrl: ENV.SUPABASE_URL,
    supabaseKey: ENV.SUPABASE_ANON_KEY,
    req,
    res,
  });

  // força o middleware a sincronizar cookies/sessão
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  return res;
}