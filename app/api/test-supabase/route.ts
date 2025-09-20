export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
        },
      }
    )

    // Teste 1: Verificar se o Supabase está acessível
    const { data: health, error: healthError } = await supabase
      .from('_supabase_health')
      .select('*')
      .limit(1)

    // Teste 2: Verificar configuração de auth
    const { data: authData, error: authError } = await supabase.auth.getSession()

    // Teste 3: Verificar se as variáveis de ambiente estão corretas
    const envCheck = {
      SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'não definido',
      NODE_ENV: process.env.NODE_ENV,
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      env: envCheck,
      health: {
        data: health,
        error: healthError?.message,
      },
      auth: {
        hasSession: !!authData.session,
        user: authData.session?.user?.id,
        error: authError?.message,
      },
      cookies: req.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value })),
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
