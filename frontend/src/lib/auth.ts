import { supabaseServer } from './supabase/server'

export async function getTenantId(): Promise<string> {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Por enquanto, retorna um tenant_id fixo
  // TODO: Implementar lógica real de tenant baseada no usuário
  return 'default-tenant'
}
