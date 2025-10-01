import { NextResponse } from 'next/server'
import { supabaseServer } from '@/utils/supabase/server'

export async function POST(req: Request) {
  console.log('=== AUTH SYNC START ===')
  const supabase = supabaseServer()
  
  // Tentar receber tokens do header ou body
  const authHeader = req.headers.get('authorization')
  const refreshToken = req.headers.get('x-refresh-token')
  
  console.log('Headers received:', {
    hasAuth: !!authHeader,
    hasRefresh: !!refreshToken,
    authPrefix: authHeader?.substring(0, 20)
  })
  
  let accessToken = null
  if (authHeader?.startsWith('Bearer ')) {
    accessToken = authHeader.substring(7)
  }
  
  // Se temos tokens, tentar setSession
  if (accessToken && refreshToken) {
    console.log('Setting session with tokens...')
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    })
    
    console.log('setSession result:', {
      hasData: !!data,
      hasError: !!error,
      error: error?.message,
      hasSession: !!data?.session
    })
    
    if (error) {
      console.log('=== AUTH SYNC ERROR ===')
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
    }
    
    console.log('=== AUTH SYNC SUCCESS ===')
    return NextResponse.json({ ok: true, session: data.session ?? null })
  }
  
  // Se não temos tokens, retornar sessão atual
  console.log('No tokens provided, checking current session...')
  const { data, error } = await supabase.auth.getSession()

  console.log('getSession result:', {
    hasData: !!data,
    hasError: !!error,
    error: error?.message,
    hasSession: !!data?.session
  })

  if (error) {
    console.log('=== AUTH SYNC ERROR ===')
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
  }
  
  console.log('=== AUTH SYNC END ===')
  return NextResponse.json({ ok: true, session: data.session ?? null })
}