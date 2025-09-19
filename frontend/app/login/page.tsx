'use client'
import { useSearchParams } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/client'

export default function LoginPage() {
  const params = useSearchParams()
  const next = params.get('next') || '/'

  async function loginGoogle() {
    const site = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    const redirectTo = `${site}/auth/callback?next=${encodeURIComponent(next)}`
    const supabase = supabaseBrowser()
    // PKCE é padrão no supabase-js v2; NÃO usar implicit
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: { prompt: 'select_account' },
      },
    })
  }

  return (
    <main style={{ maxWidth: 960, margin: '2rem auto' }}>
      <h1>Entrar</h1>
      <p>Tenant: LaplataLunaria</p>
      <button onClick={loginGoogle}>Continuar com Google</button>
    </main>
  )
}