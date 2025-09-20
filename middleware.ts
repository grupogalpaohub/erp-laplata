import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Rotas liberadas (não precisam de autenticação)
  const publicRoutes = [
    '/login',
    '/auth/callback',
    '/_next/static',
    '/_next/image',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/api/_debug'
  ];

  // Verificar se é uma rota pública
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route) || pathname === route
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Verificar cookies de sessão do Supabase
  const cookies = req.cookies.getAll();
  console.log('[middleware] all cookies:', cookies.map(c => ({ name: c.name, value: c.value?.substring(0, 20) + '...' })));
  
  const hasSupabaseSession = cookies.some(cookie => {
    const name = cookie.name;
    const value = cookie.value;
    
    // Verificar cookies de autenticação do Supabase
    const isSupabaseCookie = (
      (name.includes('sb-') && name.includes('auth-token')) ||
      (name.includes('sb-') && name.includes('.0')) ||
      (name.includes('sb-') && name.includes('.1')) ||
      (name === 'sb-access-token') ||
      (name === 'sb-refresh-token')
    );
    
    const hasValidValue = value && 
      value !== '[]' && 
      value !== 'null' && 
      value !== 'undefined' &&
      value !== '' &&
      value.length > 10; // Cookies de sessão válidos são longos
    
    console.log('[middleware] cookie check:', { name, isSupabaseCookie, hasValidValue, valueLength: value?.length });
    
    return isSupabaseCookie && hasValidValue;
  });

  console.log('[middleware] pathname:', pathname, 'hasSession:', hasSupabaseSession);

  // Se não tem sessão, redirecionar para login
  if (!hasSupabaseSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    console.log('[middleware] no session, redirecting to:', loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  console.log('[middleware] allowing access to:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};