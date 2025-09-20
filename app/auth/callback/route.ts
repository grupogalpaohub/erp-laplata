// app/auth/callback/route.ts
export const runtime = 'nodejs'

import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { siteUrl } from '@/src/lib/env'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') || '/'

  // se vier erro do provider, volta pra login com o erro
  const err = url.searchParams.get('error')
  if (err || !code) {
    const to = new URL('/login', siteUrl())
    if (err) to.searchParams.set('error', err)
    if (!code) to.searchParams.set('error', 'missing_code')
    return NextResponse.redirect(to, { status: 303 })
  }

  // Vamos preparar a resposta de redirect ANTES de criar o client,
  // e plugamos os set/remove de cookies NESTA resposta.
  const redirectTo = new URL(next.startsWith('/') ? next : '/', siteUrl())
  const res = NextResponse.redirect(redirectTo, { status: 303 })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // lê cookies atuais do request
        get: (name: string) => req.cookies.get(name)?.value,
        // grava cookies na RESPOSTA (fundamental p/ sessão persistir)
        set: (name: string, value: string, options: any) => {
          // Next 14 aceita objeto no set:
          res.cookies.set({ name, value, ...options })
        },
        // remove cookie na RESPOSTA
        remove: (name: string, options: any) => {
          res.cookies.set({ name, value: '', ...options, maxAge: 0 })
        },
      },
    }
  )

  // troca o code pelo refresh/access token e grava nos cookies httpOnly
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    const to = new URL('/login', siteUrl())
    to.searchParams.set('error', 'exchange_failed')
    return NextResponse.redirect(to, { status: 303 })
  }

  return res
}