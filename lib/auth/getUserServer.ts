import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function getUserServer() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user ?? null;
}
