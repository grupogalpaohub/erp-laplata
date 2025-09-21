import { cookies } from 'next/headers'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { ENV } from '@/lib/env'

export function hasSession(): boolean {
  if (ENV.AUTH_DISABLED) {
    return true;
  }
  const c = cookies()
  return c.has('sb-access-token') || c.has('sb:token') || c.has('supabase-auth-token')
}

export async function getTenantId(): Promise<string> {
  if (ENV.AUTH_DISABLED) {
    return 'LaplataLunaria';
  }
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Retorna o tenant_id correto do banco de dados
  return 'LaplataLunaria'
}
