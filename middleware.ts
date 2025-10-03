import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

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
  
  // Verificar auth para rotas protegidas
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
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