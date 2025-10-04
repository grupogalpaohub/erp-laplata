'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabaseBrowser'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabaseBrowser.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/login?error=auth_callback_failed')
          return
        }

        if (data.session) {
          // Usuário autenticado com sucesso
          console.log('User authenticated:', data.session.user)
          
          // Verificar se já tem tenant_id configurado
          const tenantId = data.session.user.user_metadata?.tenant_id
          
          if (!tenantId) {
            // Configurar tenant padrão para o usuário
            console.log('Setting up default tenant for user')
            // Por enquanto, usar tenant fixo - depois implementar seleção de tenant
            const { error: updateError } = await supabaseBrowser.auth.updateUser({
              data: { tenant_id: 'LaplataLunaria' }
            })
            
            if (updateError) {
              console.error('Error setting tenant:', updateError)
            }
          }
          
          router.push('/dashboard')
        } else {
          // Nenhuma sessão encontrada
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth callback exception:', error)
        router.push('/login?error=auth_callback_exception')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processando autenticação...</p>
      </div>
    </div>
  )
}
