import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PUBLIC_PATHS = [
  '/login',
  '/auth/callback',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const isPublic = PUBLIC_PATHS.some((p) => url.pathname.startsWith(p));
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Desloga não-autenticado para páginas privadas
  if (!session && !isPublic) {
    const nextParam = encodeURIComponent(url.pathname + url.search);
    return NextResponse.redirect(new URL(`/login?next=${nextParam}`, url.origin));
  }

  // Usuário logado tentando ir ao /login → manda para home (ou para ?next)
  if (session && url.pathname.startsWith('/login')) {
    const to = url.searchParams.get('next') || '/';
    return NextResponse.redirect(new URL(to, url.origin));
  }

  return res;
}

export const config = {
  matcher: [
    // protege todo app, exceto assets
    '/((?!_next/static|_next/image|assets|public).*)',
  ],
};