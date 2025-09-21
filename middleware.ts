import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/ssr';

// Importante: NO EDGE, não use lib/env.ts (usa fs/path/process.cwd etc).
// Em vez disso, use process.env.NEXT_PUBLIC_* (Next injeta em build-time).
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const runtime = 'experimental-edge';
export const config = {
  matcher: ['/((?!_next|assets|public|favicon.ico|api).*)'],
};

const PUBLIC = new Set(['/', '/login', '/auth/callback', '/auth/callback/hash']);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC.has(pathname)) return NextResponse.next();

  // Validação para evitar erros silenciosos
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('[MIDDLEWARE] SUPABASE_URL ou SUPABASE_ANON_KEY ausentes');
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({
    supabaseUrl: SUPABASE_URL,
    supabaseKey: SUPABASE_ANON_KEY,
    req,
    res,
  });

  // Força sync de sessão/cookies no Edge
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  return res;
}