// app/login/page.tsx
'use client'

import { useCallback, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabaseBrowser } from '@/src/lib/supabase/client'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'

  const handleGoogle = useCallback(async () => {
    try {
      setLoading(true)
      const redirectTo =
        (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin) + `/auth/callback?next=${encodeURIComponent(next)}`
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
    <main className="mx-auto max-w-md py-12 px-4">
      <h1 className="text-2xl font-semibold mb-6">Entrar</h1>
      <button
        onClick={handleGoogle}
        disabled={loading}
        className="rounded-md border px-4 py-2"
      >
        {loading ? 'Redirecionando…' : 'Entrar com Google'}
      </button>
    </main>
  )
}