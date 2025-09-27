
import { NextResponse, NextRequest } from 'next/server'
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const url = req.nextUrl

  // Criar cliente Supabase para refresh automático
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => res.cookies.set(name, value, options),
        remove: (name, options) => res.cookies.set(name, "", options),
      },
    }
  );

  // Força o supabase a tentar recuperar/atualizar a sessão
  await supabase.auth.getSession();

  const access = req.cookies.get('sb-access-token')?.value

  const isLogin = url.pathname === '/login'
  const isProtected = url.pathname.startsWith('/(protected)') || [
    '/mm','/crm','/sd','/wh','/fi','/co','/dashboard'
  ].some(p => url.pathname === p || url.pathname.startsWith(p + '/'))

  if (!access && isProtected) {
    const to = new URL('/login', req.url)
    return NextResponse.redirect(to)
  }

  if (access && isLogin) {
    const to = new URL('/dashboard', req.url)
    return NextResponse.redirect(to)
  }

  return res
}

export const config = {
  matcher: [
    '/login',
    '/mm/:path*','/crm/:path*','/sd/:path*','/wh/:path*','/fi/:path*','/co/:path*',
    '/dashboard/:path*','/(protected)/:path*'
  ],
}

