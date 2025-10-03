import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  
  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${error}`, request.url))
  }
  
  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url))
  }

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => {
          cookieStore.set({ name, value, ...options })
        },
        remove: (name, options) => {
          cookieStore.set({ name, value: "", ...options, expires: new Date(0) })
        }
      }
    }
  )

  try {
    const { error: authError } = await supabase.auth.exchangeCodeForSession(code)
    if (authError) {
      return NextResponse.redirect(new URL(`/login?error=${authError.message}`, request.url))
    }

    // Verificar tenant_id
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.user_metadata?.tenant_id) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    console.error('Erro no callback:', error)
    return NextResponse.redirect(new URL('/login?error=callback_error', request.url))
  }
}
