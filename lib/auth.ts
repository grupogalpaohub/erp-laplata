import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function getTenantId() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || 'default';
}
