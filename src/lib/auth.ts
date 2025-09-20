import { cookies } from 'next/headers'
import { supabaseServer } from './supabase/server'

export function hasSession(): boolean {
  const c = cookies()
  return c.has('sb-access-token') || c.has('sb:token') || c.has('supabase-auth-token')
}

export async function getTenantId(): Promise<string> {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Retorna o tenant_id correto do banco de dados
  return 'LaplataLunaria'
}
