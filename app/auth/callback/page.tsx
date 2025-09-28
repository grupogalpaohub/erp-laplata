'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Criar cliente Supabase para o lado do cliente
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // Trocar código por sessão
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          searchParams.get('code') || ''
        )

        if (error) {
          console.error('Erro no callback de autenticação:', error)
          router.push('/login?error=auth_callback_failed')
          return
        }

        if (data.session) {
          // Sessão criada com sucesso, redirecionar
          router.push(next)
        } else {
          // Sem sessão, redirecionar para login
          router.push('/login?error=no_session')
        }
      } catch (error) {
        console.error('Erro no callback:', error)
        router.push('/login?error=callback_error')
      }
    }

    handleAuthCallback()
  }, [router, next, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processando login...</p>
      </div>
    </div>
  )
}
