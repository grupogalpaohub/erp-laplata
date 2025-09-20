import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Rotas liberadas (não precisam de autenticação)
  const publicRoutes = [
    '/login',
    '/auth/callback',
    '/landing',
    '/_next/static',
    '/_next/image',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/api/_debug',
    '/api/debug',
    '/api/public',
    '/api/test-middleware'
  ];

  // Verificar se é uma rota pública
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/api/debug') {
      return pathname.startsWith('/api/debug')
    }
    if (route === '/api/public') {
      return pathname.startsWith('/api/public')
    }
    return pathname.startsWith(route) || pathname === route
  });

  if (isPublicRoute) {
    console.log('[middleware] public route, allowing:', pathname);
    return NextResponse.next();
  }

  // Verificar cookies de sessão do Supabase - abordagem mais simples
  const cookies = req.cookies.getAll();
  console.log('[middleware] checking cookies for pathname:', pathname);
  console.log('[middleware] total cookies found:', cookies.length);
  
  // Procurar por qualquer cookie do Supabase com valor válido
  let hasValidSession = false;
  
  for (const cookie of cookies) {
    const name = cookie.name;
    const value = cookie.value;
    
    // Verificar se é cookie do Supabase
    if (name.startsWith('sb-') || name.includes('supabase')) {
      console.log('[middleware] found supabase cookie:', { name, hasValue: !!value, valueLength: value?.length });
      
      // Se tem valor e não é vazio/null/undefined
      if (value && value !== '[]' && value !== 'null' && value !== 'undefined' && value.length > 5) {
        hasValidSession = true;
        console.log('[middleware] valid session found in cookie:', name);
        break;
      }
    }
  }

  console.log('[middleware] final decision - pathname:', pathname, 'hasValidSession:', hasValidSession);

  // Se não tem sessão válida, redirecionar para login
  if (!hasValidSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    console.log('[middleware] REDIRECTING to login:', loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  console.log('[middleware] ALLOWING access to:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};