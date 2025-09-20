'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function LandingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Se já está logado, redirecionar para o ERP
        router.push('/')
      } else {
        // Se não está logado, redirecionar para login
        router.push('/login')
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
          <div className="loading-fiori">
            <div className="spinner-fiori mr-2"></div>
            Carregando...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">E</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">ERP LaPlata Lunaria</h1>
        <p className="text-xl text-gray-600 mb-8">Sistema de Gestão Empresarial</p>
        <div className="loading-fiori">
          <div className="spinner-fiori mr-2"></div>
          Redirecionando...
        </div>
      </div>
    </div>
  )
}
