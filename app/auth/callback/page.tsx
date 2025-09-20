import { supabaseServer } from '@/src/lib/supabaseServer'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { next?: string }
}) {
  try {
    const supabase = supabaseServer()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Auth callback error:', error)
      redirect('/login?error=auth_failed')
    }
    
    if (!user) {
      redirect('/login?error=no_user')
    }
    
    // Redirecionar para a página solicitada ou home
    const next = searchParams.next || '/'
    redirect(next)
    
  } catch (error) {
    console.error('Auth callback error:', error)
    redirect('/login?error=callback_failed')
  }
}
