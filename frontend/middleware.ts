import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_PATHS = new Set([
  '/', '/login', '/auth/callback', '/favicon.ico'
])

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isPublic =
    PUBLIC_PATHS.has(pathname) ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/public/') ||
    pathname.startsWith('/assets/')

  // Prepare a mutable response to allow cookie writes by Supabase
  const res = NextResponse.next()

  if (isPublic) return res

  // Edge-safe Supabase client (usa cookies de req/res)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.getUser()

  if (error) {
    console.error('middleware:getUser error:', error.message)
  }

  if (!data?.user) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname || '/')
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public|assets).*)'],
}
