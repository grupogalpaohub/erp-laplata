import { supabaseServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Endpoint exclusivamente para manipular cookies de sessão se necessário.
// Mantém compatibilidade com o App Router: cookies só podem ser setados aqui
// (Server Route) ou em Server Actions.
export async function POST(request: Request) {
  // ✅ GUARDRAIL COMPLIANCE: API usando supabaseServer()
  const sb = supabaseServer()
  // se precisar setar/limpar algo, faça aqui via NextResponse.cookies
  const res = NextResponse.json({ ok: true })
  // exemplo (desabilitado por padrão):
  // res.cookies.set('sb-tenant', 'LaplataLunaria', { httpOnly: true, sameSite: 'lax' })
  return res
}