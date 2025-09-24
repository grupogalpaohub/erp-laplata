'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabaseBrowser'

export default function LoginClient({ next }: { next: string }) {
  const router = useRouter()

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.replace(/^#/, ''))
      const access_token = params.get('access_token') || ''
      const refresh_token = params.get('refresh_token') || ''
      if (access_token && refresh_token) {
        const sb = createSupabaseBrowserClient()
        sb.auth.setSession({ access_token, refresh_token }).finally(() => router.replace(next))
        return
      }
      router.replace(next)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const siteURL = process.env.NEXT_PUBLIC_SITE_URL || ''
  const googleUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(`${siteURL}/auth/callback?next=${encodeURIComponent(next)}`)}`

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Entrar</h1>
      <p>Tenant: {process.env.NEXT_PUBLIC_TENANT_ID || 'default'}</p>
      <a href={googleUrl}>Continuar com Google</a>
      <p style={{ marginTop: 12 }}>
        <Link href="/">Voltar</Link>
      </p>
    </main>
  )
}
