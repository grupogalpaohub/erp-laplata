import { supabaseServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // ✅ GUARDRAIL COMPLIANCE: API usando supabaseServer()
  const sb = supabaseServer()
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