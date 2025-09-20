import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { next?: string; code?: string; error?: string }
}) {
  try {
    // Verificar se há erro na URL
    if (searchParams.error) {
      console.error('OAuth error:', searchParams.error)
      redirect('/login?error=oauth_error')
    }

    // Verificar se há código de autorização
    if (!searchParams.code) {
      console.error('No authorization code received')
      redirect('/login?error=no_code')
    }

    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {
              // Ignore cookie setting errors
            }
          },
        },
      }
    )

    // Trocar código por sessão
    const { data, error } = await supabase.auth.exchangeCodeForSession(searchParams.code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      redirect('/login?error=session_error')
    }
    
    if (!data.user) {
      console.error('No user after code exchange')
      redirect('/login?error=no_user')
    }
    
    console.log('Auth successful for user:', data.user.email)
    
    // Redirecionar para a página solicitada ou home
    const next = searchParams.next || '/'
    redirect(next)
    
  } catch (error) {
    console.error('Auth callback error:', error)
    redirect('/login?error=callback_failed')
  }
}
