import { supabaseServer } from '@/lib/supabase/server'

// Função que obtém tenant do JWT do usuário autenticado
export async function getTenantId(): Promise<string | null> {
  try {
    const supabase = supabaseServer()
    
    // Obter usuário autenticado
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      console.log('getTenantId - No authenticated user:', error?.message)
      return null
    }
    
    // Extrair tenant_id do JWT claims
    const claims = user.user_metadata
    const tenantId = claims?.tenant_id || claims?.tenantId
    
    if (!tenantId) {
      console.log('getTenantId - No tenant_id in user metadata:', claims)
      return null
    }
    
    return tenantId
  } catch (error) {
    console.error('getTenantId - Error:', error)
    return null
  }
}

// lança se não houver tenant
export async function requireTenantId(): Promise<string> {
  const t = await getTenantId();
  if (!t) {
    // Em desenvolvimento, usar tenant padrão
    if (process.env.NODE_ENV === 'development') {
      console.log('requireTenantId - Usando tenant padrão para desenvolvimento')
      return 'LaplataLunaria'
    }
    throw new Error("MISSING_TENANT_ID");
  }
  return t;
}

// lista branca de tenants válidos (temporário, sem UI nova)
export const ALLOWED_TENANTS = ["LaplataLunaria"] as const;
export function isAllowedTenant(x: string): x is typeof ALLOWED_TENANTS[number] {
  return ALLOWED_TENANTS.includes(x as any);
}