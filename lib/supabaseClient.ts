import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export function createSupabaseClient() {
  // Acessar variáveis diretamente para evitar importar lib/env no browser
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const authDisabled = process.env.AUTH_DISABLED === 'true' || process.env.AUTH_DISABLED === '1'
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Para componentes cliente, sempre usar service role para bypass RLS
  if (authDisabled && serviceRoleKey) {
    return createClient(
      supabaseUrl || 'https://gpjcfwjssfvqhppxdudp.supabase.co',
      serviceRoleKey
    )
  }

  // Verificar variáveis apenas quando auth não está desabilitada
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL/ANON ausentes. Verifique .env.local.')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}
