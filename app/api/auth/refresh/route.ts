import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  // ✅ GUARDRAIL COMPLIANCE: API usando @supabase/ssr e cookies()
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set() {},
        remove() {}
      }
    }
  )
  const { event, session } = await req.json().catch(() => ({}))
  const res = NextResponse.json({ ok: true })

  const isProd = process.env.NODE_ENV === 'production'
  const common = { httpOnly: true, secure: isProd, sameSite: 'lax' as const, path: '/' }

  // se saiu ou sessão ausente -> limpa cookies
  if (event === 'SIGNED_OUT' || !session?.access_token) {
    res.cookies.set('sb-access-token', '', { ...common, maxAge: 0 })
    res.cookies.set('sb-refresh-token', '', { ...common, maxAge: 0 })
    return res
  }

  // seta/atualiza cookies httpOnly
  res.cookies.set('sb-access-token', session.access_token, { ...common, maxAge: 60 * 60 }) // 1h
  if (session.refresh_token) {
    res.cookies.set('sb-refresh-token', session.refresh_token, {
      ...common,
      maxAge: 60 * 60 * 24 * 14, // 14d
    })
  }
  return res
}