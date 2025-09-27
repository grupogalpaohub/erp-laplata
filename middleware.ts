
import { NextResponse, NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl
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
    const to = new URL('/', req.url) // ou /dashboard
    return NextResponse.redirect(to)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/mm/:path*','/crm/:path*','/sd/:path*','/wh/:path*','/fi/:path*','/co/:path*',
    '/dashboard/:path*','/(protected)/:path*'
  ],
}

