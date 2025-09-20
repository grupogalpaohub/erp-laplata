'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

function siteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || ''
  if (!raw) return 'http://localhost:3000'
  return raw.startsWith('http') ? raw.replace(/\/+$/, '') : `https://${raw}`.replace(/\/+$/, '')
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const sp = useSearchParams()
  const next = sp.get('next') || '/'

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function signIn() {
    setLoading(true)
    const redirectTo = `${siteUrl()}/auth/callback?next=${encodeURIComponent(next)}`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, queryParams: { prompt: 'select_account' } },
    })
    if (error) {
      console.error('[login] OAuth error:', error.message)
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