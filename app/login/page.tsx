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
    
    console.log('[login] iniciando OAuth:', {
      provider: 'google',
      redirectTo,
      siteUrl: siteUrl(),
      next
    })
    
    const { data, error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, queryParams: { prompt: 'select_account' } },
    })
    
    console.log('[login] OAuth response:', { data, error })
    
    if (error) {
      console.error('[login] oauth error:', error.message)
      alert(`Erro OAuth: ${error.message}`)
      setLoading(false)
    } else if (data?.url) {
      console.log('[login] redirecionando para:', data.url)
      window.location.href = data.url
    } else {
      console.warn('[login] sem URL de redirecionamento')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="card-fiori max-w-md w-full mx-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">ERP LaPlata</h1>
          <p className="text-gray-300 mb-8">Sistema de Gestão Empresarial</p>
          
          <button
            type="button"
            onClick={signIn}
            disabled={loading}
            className="btn-fiori-primary w-full flex items-center justify-center gap-3 py-3 text-lg"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Entrar com Google
              </>
            )}
          </button>
          
          <p className="text-sm text-gray-400 mt-6">
            Acesse sua conta para continuar
          </p>
        </div>
      </div>
    </div>
  )
}