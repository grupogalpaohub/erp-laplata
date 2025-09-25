
// ============================================================================
// 🔒 REGRAS IRREVERSÍVEIS - NÃO ALTERAR
// ============================================================================
// ❌ PROIBIDO: Hardcode de tenant (LaplataLunaria, etc.)
// ❌ PROIBIDO: process.env.TENANT_ID (não existe)
// ❌ PROIBIDO: Alterar .env.local
// ❌ PROIBIDO: Desabilitar RLS
// ❌ PROIBIDO: SERVICE_ROLE_KEY no frontend
// ✅ OBRIGATÓRIO: Usar NEXT_PUBLIC_AUTH_DISABLED
// ✅ OBRIGATÓRIO: Investigação profunda antes de corrigir
// ============================================================================
// lib/auth/requireSession.ts
import 'server-only';
import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase/server';
import { ENV } from '@/lib/env';

export async function requireSession() {
  // Se auth está desabilitada, retorna sessão mock
  if (ENV.AUTH_DISABLED || process.env.NEXT_PUBLIC_AUTH_DISABLED === 'true') {
    const supabase = getSupabaseServer();
    return { 
      supabase, 
      session: { user: { id: 'dev-user', user_metadata: { tenant_id: 'default' } } }, 
      user: { id: 'dev-user', user_metadata: { tenant_id: 'default' } }, 
      tenantId: 'default' 
    };
  }

  const supabase = getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  // onde a RLS espera encontrar o tenant_id: user_metadata.tenant_id
  const tenantId =
    (session.user.user_metadata as any)?.tenant_id ??
    (session.user.app_metadata as any)?.tenant_id ?? null;

  return { supabase, session, user: session.user, tenantId };
}

