import { NextResponse } from 'next/server'

export async function middleware(req: any) {
  const { pathname } = req.nextUrl
  
  // Permitir callback, login, onboarding, landing
  if (pathname.startsWith('/auth/') || 
      pathname === '/login' || 
      pathname === '/onboarding' ||
      pathname === '/landing') {
    return NextResponse.next()
  }
  
  // Redirecionar rota raiz para landing
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/landing', req.url))
  }
  
  // Para rotas protegidas, deixar o FioriShell fazer a verificação
  // O middleware só redireciona rotas públicas
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}