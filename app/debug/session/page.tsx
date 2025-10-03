import { supabaseServer } from '@/lib/supabase/server'

export const runtime = 'nodejs';

export default async function DebugSessionPage() {
  const supabase = supabaseServer()
  
  // Verificar sessão
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  
  // Verificar usuário
  const { data: userData, error: userError } = await supabase.auth.getUser()
  
  // Verificar cookies
  const { cookies } = await import('next/headers')
  const cookieStore = cookies()
  const authCookies = cookieStore.getAll().filter(c => c.name.startsWith('sb-'))
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug de Sessão</h1>
      
      <div className="space-y-6">
        {/* Sessão */}
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Sessão</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify({ sessionData, sessionError }, null, 2)}
          </pre>
        </div>
        
        {/* Usuário */}
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Usuário</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify({ userData, userError }, null, 2)}
          </pre>
        </div>
        
        {/* Cookies */}
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Cookies de Auth</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(authCookies, null, 2)}
          </pre>
        </div>
        
        {/* Variáveis de Ambiente */}
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Variáveis de Ambiente</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify({
              SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Definida' : 'Não definida',
              SUPABASE_ANON: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Definida' : 'Não definida',
              TENANT_ID: process.env.NEXT_PUBLIC_TENANT_ID
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
