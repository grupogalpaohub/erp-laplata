'use client'

export const dynamic = 'force-dynamic' // evita cache/otimização

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
      const base = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      const redirectTo = `${base}/auth/callback${
        next ? `?next=${encodeURIComponent(next)}` : ''
      }`

      const supabase = supabaseBrowser()

      // Algumas versões NÃO redirecionam automaticamente:
      // usamos fallback para forçar a navegação se vier a URL.
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          // melhora DX em múltiplas contas
          queryParams: { prompt: 'select_account' },
        },
      })

      if (error) {
        console.error('[OAuth] signInWithOAuth error:', error)
        alert(error.message)
        return
      }

      // Fallback universal de redirecionamento
      const target = data?.url
      console.log('[OAuth] Response data:', { data, hasUrl: !!target })
      
      if (target) {
        console.log('[OAuth] Redirecting to:', target)
        window.location.assign(target)
      } else {
        console.warn('[OAuth] No redirect URL received from Supabase')
      }
      // Se o SDK fizer o redirect automático, este trecho nem roda.
    } finally {
      setLoading(false)
    }
  }, [next])

  return (
    <main className="mx-auto max-w-md min-h-[60vh] flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Entrar</h1>
      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        className="rounded-md border px-4 py-2 bg-fiori-accent text-white disabled:opacity-60"
      >
        {loading ? 'Redirecionando…' : 'Entrar com Google'}
      </button>
    </main>
  )
}