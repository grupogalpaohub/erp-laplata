// lib/auth/requireSession.ts
import 'server-only';
import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase/server';

export async function requireSession() {
  const supabase = getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  // onde a RLS espera encontrar o tenant_id: user_metadata.tenant_id
  const tenantId =
    (session.user.user_metadata as any)?.tenant_id ??
    (session.user.app_metadata as any)?.tenant_id ?? null;

  return { supabase, session, user: session.user, tenantId };
}
