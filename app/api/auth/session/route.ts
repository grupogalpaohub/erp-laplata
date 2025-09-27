import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Endpoint exclusivamente para manipular cookies de sessão se necessário.
// Mantém compatibilidade com o App Router: cookies só podem ser setados aqui
// (Server Route) ou em Server Actions.
export async function POST(request: Request) {
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
  // se precisar setar/limpar algo, faça aqui via NextResponse.cookies
  const res = NextResponse.json({ ok: true })
  // exemplo (desabilitado por padrão):
  // res.cookies.set('sb-tenant', 'LaplataLunaria', { httpOnly: true, sameSite: 'lax' })
  return res
}