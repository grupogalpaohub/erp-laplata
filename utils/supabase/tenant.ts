// utils/supabase/tenant.ts
// Helper para obter tenant_id da sessão (GUARDRAIL COMPLIANCE)

import { supabaseServer } from './server';
import { TenantId } from '@/src/types/db';

export async function getTenantFromSession(): Promise<TenantId> {
  const supabase = supabaseServer();
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw new Error(`Erro ao obter sessão: ${error.message}`);
    }
    
    if (!session?.user) {
      throw new Error('Usuário não autenticado');
    }
    
    // Extrair tenant_id do JWT ou usar default
    const tenantId = session.user.user_metadata?.tenant_id || 'LaplataLunaria';
    
    return tenantId as TenantId;
  } catch (error) {
    console.error('Erro ao obter tenant_id:', error);
    throw new Error('Falha na autenticação - tenant_id não encontrado');
  }
}

export async function requireTenantSession(): Promise<{ tenant_id: TenantId; user_id: string }> {
  const supabase = supabaseServer();
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw new Error(`Erro ao obter sessão: ${error.message}`);
    }
    
    if (!session?.user) {
      throw new Error('Usuário não autenticado');
    }
    
    const tenantId = session.user.user_metadata?.tenant_id || 'LaplataLunaria';
    const userId = session.user.id;
    
    return {
      tenant_id: tenantId as TenantId,
      user_id: userId
    };
  } catch (error) {
    console.error('Erro ao obter sessão do tenant:', error);
    throw new Error('Falha na autenticação - sessão inválida');
  }
}
