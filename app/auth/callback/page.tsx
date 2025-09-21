'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Processando...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('Verificando parâmetros...')
        
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const next = searchParams.get('next') || '/'

        if (error) {
          console.error('OAuth error:', error)
          setError(`Erro OAuth: ${error}`)
          setStatus('Erro na autenticação')
          setTimeout(() => router.replace('/login?error=oauth_error'), 2000)
          return
        }

        if (!code) {
          console.error('No authorization code received')
          setError('Código de autorização não encontrado')
          setStatus('Erro na autenticação')
          setTimeout(() => router.replace('/login?error=no_code'), 2000)
          return
        }

        setStatus('Conectando com Supabase...')
        
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gpjcfwjssfvqhppxdudp.supabase.co',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwamNmd2pzc2Z2cWhwcHhkdWRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDQyOTUsImV4cCI6MjA3MzUyMDI5NX0.6h6ogP8aMCvy7fUN1mbxSK-O0TbGiEIP5rO5z0s0r0'
        )

        setStatus('Trocando código por sessão...')
        
        // Trocar código por sessão
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (exchangeError) {
          console.error('Error exchanging code for session:', exchangeError)
          setError(`Erro na troca de código: ${exchangeError.message}`)
          setStatus('Erro na autenticação')
          setTimeout(() => router.replace('/login?error=session_error'), 2000)
          return
        }
        
        if (!data.user) {
          console.error('No user after code exchange')
          setError('Usuário não encontrado após autenticação')
          setStatus('Erro na autenticação')
          setTimeout(() => router.replace('/login?error=no_user'), 2000)
          return
        }
        
        console.log('Auth successful for user:', data.user.email)
        setStatus('Autenticação bem-sucedida!')
        
        // Aguardar um pouco para mostrar sucesso
        setTimeout(() => {
          router.replace(next)
        }, 1000)
        
      } catch (error) {
        console.error('Auth callback error:', error)
        setError(`Erro geral: ${error}`)
        setStatus('Erro na autenticação')
        setTimeout(() => router.replace('/login?error=callback_failed'), 2000)
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-fiori-primary flex items-center justify-center">
      <div className="card-fiori p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-fiori-accent rounded-lg flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-2xl">E</span>
        </div>
        
        <h1 className="text-2xl font-semibold text-fiori-primary-text mb-4">
          {status}
        </h1>
        
        {error && (
          <div className="alert-fiori-danger mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        <div className="loading-fiori">
          <div className="spinner-fiori"></div>
        </div>
        
        <p className="text-fiori-secondary-text mt-4">
          Por favor, aguarde enquanto processamos seu login.
        </p>
      </div>
    </div>
  )
}
