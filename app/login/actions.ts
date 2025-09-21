'use server';

import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { ENV } from '@/lib/env';

export async function loginWithGoogle(next?: string) {
  const supabase = createSupabaseServerClient();

  // SEMPRE usa o SITE_URL do ambiente atual (localhost em dev)
  const redirectTo = `${ENV.SITE_URL}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`;

  // log pra auditar no terminal
  console.log('[auth] redirectTo =>', redirectTo);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });
  if (error) throw error;
  return data.url!;
}