'use server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { ENV } from '@/lib/env';

export async function loginWithGoogle(next?: string) {
  if (ENV.AUTH_DISABLED) {
    // Retorna URL da home quando auth está desativada
    return `${ENV.SITE_URL}${next || '/'}`;
  }
  
  const supabase = getSupabaseServerClient();
  const redirectTo = `${ENV.SITE_URL}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`;
  console.log('[auth] redirectTo =>', redirectTo);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });
  if (error) throw error;
  return data.url!;
}

