"use client"
import { useState } from "react"
import { supabaseBrowser } from "@/lib/supabase/client"

export default function LoginClient() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debug: verificar variáveis de ambiente
  console.log('🔍 Debug LoginClient:', {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Definida' : 'Não definida',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Definida' : 'Não definida',
    windowOrigin: typeof window !== 'undefined' ? window.location.origin : 'SSR'
  })

  const handleGoogleLogin = async () => {
    console.log('🔵 Botão de login clicado!')
    setLoading(true)
    setError(null)
    
    try {
      console.log('🔵 Criando cliente Supabase...')
      const supabase = supabaseBrowser()
      
      console.log('🔵 Iniciando OAuth com Google...')
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      console.log('🔵 Resultado OAuth:', { error })
      
      if (error) {
        console.error('❌ Erro OAuth:', error)
        setError(error.message)
        setLoading(false)
      } else {
        console.log('✅ OAuth iniciado com sucesso!')
      }
    } catch (err) {
      console.error('❌ Erro inesperado:', err)
      setError('Erro inesperado')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Entrar no ERP
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Acesse sua conta para continuar
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Entrando...' : '🔵 Entrar com Google'}
          </button>
          
          <div className="text-center text-xs text-gray-500">
            Clique no botão acima para fazer login
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/20 rounded-md">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}