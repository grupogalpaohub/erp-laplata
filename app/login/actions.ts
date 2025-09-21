'use server';
import { createSupabaseServerClient } from '@/src/lib/supabase/server';
import { ENV } from '@/src/lib/env';

// export const runtime = 'nodejs';

export async function loginWithGoogle(next?: string) {
  const supabase = createSupabaseServerClient();
  const redirectTo = `${ENV.SITE_URL}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`;

  // Debug: log da URL de redirecionamento
  console.log('[LOGIN] OAuth redirect URL:', {
    SITE_URL: ENV.SITE_URL,
    redirectTo,
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_ENV: process.env.VERCEL_ENV
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });
  if (error) throw error;
  return data.url;
}
