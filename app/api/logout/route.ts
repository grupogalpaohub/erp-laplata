export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function POST(req: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Fazer logout no Supabase
    await supabase.auth.signOut()
    
    // Criar resposta de redirecionamento
    const response = NextResponse.redirect(new URL('/login', req.url))
    
    // Limpar cookies de sessão
    response.cookies.delete('sb-access-token')
    response.cookies.delete('sb-refresh-token')
    
    // Limpar todos os cookies do Supabase
    const cookies = req.cookies.getAll()
    cookies.forEach(cookie => {
      if (cookie.name.includes('sb-')) {
        response.cookies.delete(cookie.name)
      }
    })
    
    return response
    
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.redirect(new URL('/login', req.url))
  }
}
