import { NextResponse, NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const pathname = url.pathname

  const PUBLIC: (string|RegExp)[] = [
    '/', '/login', '/auth/callback', '/auth/callback/hash',
    /^\/_next\//, /^\/favicon\.ico$/, /^\/public\//
  ]

  if (PUBLIC.some(p => (typeof p==='string' ? p===pathname : p.test(pathname)))) {
    return NextResponse.next()
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name)=> req.cookies.get(name)?.value } } as any
  )
  const { data } = await supabase.auth.getUser()
  if (!data.user) {
    const login = new URL('/login', url.origin)
    login.searchParams.set('next', pathname)
    return NextResponse.redirect(login)
  }
  return NextResponse.next()
}
export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] }
