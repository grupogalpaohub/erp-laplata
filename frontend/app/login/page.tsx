import Link from 'next/link'
import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase/server'

export default async function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  const next = searchParams?.next || '/'
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect(next)

  const siteURL = process.env.NEXT_PUBLIC_SITE_URL || ''

  // Supabase gera link oauth code flow
  const googleUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(`${siteURL}/auth/callback?next=${encodeURIComponent(next)}`)}`

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Entrar</h1>
      <p>Tenant: LaplataLunaria</p>
      <a href={googleUrl}>Continuar com Google</a>
      <p style={{ marginTop: 12 }}>
        <Link href="/">Voltar</Link>
      </p>
    </main>
  )
}