import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { ENV } from '@/lib/env';

export async function getTenantId() {
  if (ENV.AUTH_DISABLED) {
    return 'LaplataLunaria';
  }
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || 'LaplataLunaria';
}
