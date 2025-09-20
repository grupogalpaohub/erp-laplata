// Rota de callback do OAuth (ex.: Supabase/Google)
// ➜ Executa no Node runtime (pode usar APIs Node/Supabase no servidor)
export const runtime = 'nodejs'

import { NextResponse, type NextRequest } from 'next/server'
import { siteUrl } from '@/src/lib/env'

/**
 * Esta rota lida com:
 * - redirect do provedor OAuth (query ?code, ?error, etc.)
 * - redireciona o usuário para "next" (ou home) após o login
 * 
 * Observação:
 * - Se o fluxo vier com fragmento hash (#access_token=...), a página
 *   /auth/callback/hash (client) deve capturar e converter para cookies,
 *   mas isso é opcional e depende da configuração do Supabase/Auth.
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const nextParam = url.searchParams.get('next')
    const error = url.searchParams.get('error')
    const base = siteUrl()

    // Se veio erro do provedor, manda de volta ao login com mensagem simples
    if (error) {
      const to = new URL('/login', base)
      to.searchParams.set('error', error)
      return NextResponse.redirect(to)
    }

    // Se o Supabase/Auth setou cookies no callback, basta redirecionar
    // Caso contrário, a página /auth/callback/hash pode tratar o #access_token
    const nextUrl = nextParam && nextParam.startsWith('/') ? nextParam : '/'
    const to = new URL(nextUrl, base)
    return NextResponse.redirect(to)
  } catch (error: any) {
    // Corrige typos ("message", não "mes...age")
    // Log controlado; não vaza detalhes sensíveis
    console.error('Auth callback error:', error?.message || String(error))
    // Em caso de exceção, retornar usuário ao login
    const to = new URL('/login', siteUrl())
    to.searchParams.set('error', 'auth_callback_failed')
    return NextResponse.redirect(to)
  }
}
