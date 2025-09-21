import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Rotas públicas que não exigem sessão
const PUBLIC_PATHS = new Set<string>([
  '/',             // landing (pode ser sua landing pública)
  '/landing',      // se usar landing separada
  '/login',
  '/auth/callback'
]);

/**
 * Heurística simples: detecta cookies de sessão do Supabase
 * sem inicializar cliente no middleware (evita erros em build).
 */
function hasSupabaseSessionCookie(req: NextRequest) {
  const cookies = req.cookies.getAll().map((c) => c.name);
  // Formatos típicos: sb-<ref>-auth-token.0 / .1 / -code-verifier
  return cookies.some((n) => n.startsWith('sb-') && n.includes('auth-token'));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignorar APIs, estáticos e imagens do Next
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/auth/_debug') // caso tenha rotas de debug internas
  ) {
    return NextResponse.next();
  }

  // Permitir acesso às páginas públicas
  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  // Checar sessão
  const logged = hasSupabaseSessionCookie(req);
  if (!logged) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname || '/');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// IMPORTANT: Não intercepte /api e estáticos
export const config = {
  matcher: [
    '/((?!api|_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
};