import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const supabase = supabaseServer()
    const cookieStore = cookies()
    
    // Verificar cookies
    const allCookies = cookieStore.getAll()
    const supabaseCookies = allCookies.filter(c => c.name.startsWith('sb-'))
    
    // Verificar sessão
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    const { data: userData, error: userError } = await supabase.auth.getUser()
    
    return NextResponse.json({
      cookies: {
        total: allCookies.length,
        supabase: supabaseCookies.length,
        supabaseCookies: supabaseCookies.map(c => ({ name: c.name, hasValue: !!c.value }))
      },
      session: {
        hasSession: !!sessionData.session,
        userEmail: sessionData.session?.user?.email,
        error: sessionError?.message
      },
      user: {
        hasUser: !!userData.user,
        userEmail: userData.user?.email,
        error: userError?.message
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

