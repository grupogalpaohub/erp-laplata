import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Pular middleware para rotas de API
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Pular middleware para assets
  if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  // Verificar se há cookies de sessão do Supabase
  const cookies = req.cookies.getAll();
  const hasSupabaseSession = cookies.some(cookie => 
    cookie.name.includes('sb-') && 
    cookie.name.includes('auth-token') && 
    cookie.value && 
    cookie.value !== '[]'
  );

  console.log('[middleware] pathname:', pathname, 'hasSession:', hasSupabaseSession);

  const isAuthPage = pathname.startsWith("/login");

  if (!hasSupabaseSession && !isAuthPage) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    console.log('[middleware] no session, redirecting to:', loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  if (hasSupabaseSession && isAuthPage) {
    console.log('[middleware] has session, redirecting to home');
    return NextResponse.redirect(new URL("/", req.url));
  }

  console.log('[middleware] allowing access to:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};