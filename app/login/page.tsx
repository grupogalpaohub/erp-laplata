'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { siteUrl } from '@/src/lib/env'

export default function LoginPage() {
  const sp = useSearchParams()
  const next = sp.get('next') || '/'
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Fallback para implicit flow (#access_token no hash)
  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.replace(/^#/, ''))
      const access_token = params.get('access_token') || ''
      const refresh_token = params.get('refresh_token') || ''
      const sb = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      if (access_token && refresh_token) {
        sb.auth.setSession({ access_token, refresh_token })
          .finally(() => router.replace(next))
      } else {
        router.replace(next)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function signIn() {
    setLoading(true)
    const sb = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const redirectTo = `${siteUrl()}/auth/callback?next=${encodeURIComponent(next)}`
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, queryParams: { prompt: 'select_account' } },
    })
    if (error) {
      console.error('[login] oauth error:', error.message)
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-md min-h-[60vh] flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Entrar</h1>
      <button
        type="button"
        onClick={signIn}
        disabled={loading}
        className="rounded-md border px-4 py-2 bg-fiori-accent text-white disabled:opacity-60"
      >
        Entrar com Google
      </button>
    </main>
  )
}