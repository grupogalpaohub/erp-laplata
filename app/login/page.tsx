'use client'

import { useCallback, useMemo, useState } from 'react'
import { supabaseBrowser } from '@/src/lib/supabase/client'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const next = useMemo(() => {
    if (typeof window === 'undefined') return '/'
    const p = new URLSearchParams(window.location.search)
    return p.get('next') || '/'
  }, [])

  const handleGoogle = useCallback(async () => {
    setLoading(true)
    try {
      // Propaga o "next" para a callback
      const base = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      const redirectTo = `${base}/auth/callback${
        next ? `?next=${encodeURIComponent(next)}` : ''
      }`

      const supabase = supabaseBrowser()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      })
      if (error) alert(error.message)
    } finally {
      setLoading(false)
    }
  }, [next])

  return (
    <main className="mx-auto max-w-md min-h-[60vh] flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Entrar</h1>
      <button
        onClick={handleGoogle}
        disabled={loading}
        className="rounded-md border px-4 py-2 bg-fiori-accent text-white disabled:opacity-60"
      >
        {loading ? 'Redirecionando…' : 'Entrar com Google'}
      </button>
    </main>
  )
}