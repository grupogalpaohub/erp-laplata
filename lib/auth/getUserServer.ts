import { ENV } from '@/lib/env';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function getUserServer() {
  if (ENV.AUTH_DISABLED) {
    return {
      id: 'dev-user',
      email: 'dev@local',
      user_metadata: { name: 'Dev User', role: 'ADMIN' },
    };
  }
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user ?? null;
}