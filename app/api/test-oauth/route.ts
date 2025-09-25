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

    // Teste: Verificar se conseguimos criar uma URL de OAuth
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://workspace-mu-livid.vercel.app'}/auth/callback`,
        queryParams: { prompt: 'select_account' }
      }
    })

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      oauth: {
        hasUrl: !!data?.url,
        url: data?.url,
        error: error?.message,
      },
      config: {
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://workspace-mu-livid.vercel.app',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

