'use client'

import { useCallback, useState } from 'react'
import { supabaseBrowser } from '@/src/lib/supabase/client'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleGoogle = useCallback(async () => {
    setLoading(true)
    try {
      const redirectTo =
        (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin) + '/auth/callback'
      const supabase = supabaseBrowser()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      })
      if (error) alert(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

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