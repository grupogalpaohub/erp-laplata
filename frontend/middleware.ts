import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

const PUBLIC_PATHS = [
  '/', '/login', '/auth/callback',
  '/favicon.ico'
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isPublic =
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/public/') ||
    pathname.startsWith('/assets/')

  if (isPublic) return NextResponse.next()

  // Protege módulos do ERP
  const supabase = supabaseServer()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname || '/')
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|assets).*)',
  ],
}