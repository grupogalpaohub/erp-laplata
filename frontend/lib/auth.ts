import { supabaseServer } from './supabase/server'

/**
 * Obtém o tenant_id do usuário autenticado
 * Primeiro tenta obter de user.app_metadata.tenant_id
 * Se não existir, tenta obter de user.user_metadata.tenant_id
 * Fallback temporário para 'LaplataLunaria' (deve ser removido em produção)
 */
export async function getTenantId(): Promise<string> {
  const supabase = supabaseServer()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      console.warn('No authenticated user found, using fallback tenant')
      return 'LaplataLunaria' // Fallback temporário
    }

    // Tenta obter de app_metadata primeiro
    const appTenantId = user.app_metadata?.tenant_id
    if (appTenantId) {
      return appTenantId
    }

    // Tenta obter de user_metadata como fallback
    const userTenantId = user.user_metadata?.tenant_id
    if (userTenantId) {
      return userTenantId
    }

    // Se não encontrou em nenhum lugar, usa fallback
    console.warn(`No tenant_id found in user metadata for user ${user.id}, using fallback`)
    return 'LaplataLunaria' // Fallback temporário
  } catch (error) {
    console.error('Error getting tenant_id:', error)
    return 'LaplataLunaria' // Fallback temporário
  }
}

/**
 * Obtém informações completas do usuário autenticado
 */
export async function getCurrentUser() {
  const supabase = supabaseServer()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

