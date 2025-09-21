export const runtime = 'nodejs'

import { NextResponse, type NextRequest } from 'next/server'
import { ENV } from '@/lib/env'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const error = url.searchParams.get('error')
    const nextParam = url.searchParams.get('next')
    const base = ENV.SITE_URL

    if (error) {
      const to = new URL('/login', base)
      to.searchParams.set('error', error)
      return NextResponse.redirect(to)
    }

    const nextUrl = nextParam && nextParam.startsWith('/') ? nextParam : '/'
    const to = new URL(nextUrl, base)
    return NextResponse.redirect(to)
  } catch (error: any) {
    console.error('Auth callback error:', error?.message || String(error))
    const to = new URL('/login', ENV.SITE_URL)
    to.searchParams.set('error', 'auth_callback_failed')
    return NextResponse.redirect(to)
  }
}
