'use server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ENV } from '@/lib/env';

// export const runtime = 'nodejs';

export async function loginWithGoogle(next?: string) {
  const supabase = createSupabaseServerClient();
  const redirectTo = `${ENV.SITE_URL}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });
  if (error) throw error;
  return data.url;
}
