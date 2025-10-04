import { supabaseServer } from '@/lib/supabase/server'

// Função para configurar tenant_id no usuário após login
export async function setupUserTenant(userId: string, tenantId: string) {
  try {
    const supabase = supabaseServer()
    
    // Atualizar user_metadata com tenant_id
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        tenant_id: tenantId
      }
    })
    
    if (error) {
      console.error('Error setting up user tenant:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Exception setting up user tenant:', error)
    return false
  }
}

// Função para obter tenant_id do usuário atual
export async function getUserTenantId(): Promise<string | null> {
  try {
    const supabase = supabaseServer()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }
    
    return user.user_metadata?.tenant_id || null
  } catch (error) {
    console.error('Error getting user tenant:', error)
    return null
  }
}
