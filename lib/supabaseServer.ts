import { cookies, headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { ENV } from '@/lib/env';

export const runtime = 'nodejs';

export function createSupabaseServerClient() {
  if (!ENV.SUPABASE_URL || !ENV.SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL/ANON ausentes. Verifique .env.local.');
  }
  
  // Se auth está desabilitada, usar service role para bypass RLS
  if (ENV.AUTH_DISABLED && ENV.SERVICE_ROLE_KEY) {
    return createServerClient(ENV.SUPABASE_URL, ENV.SERVICE_ROLE_KEY, {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
      headers: {
        'x-forwarded-host': headers().get('x-forwarded-host') ?? undefined,
        'x-forwarded-proto': headers().get('x-forwarded-proto') ?? undefined,
      },
    });
  }

  const cookieStore = cookies();
  const h = headers();

  return createServerClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set({ name, value, ...options });
          });
        } catch {}
      },
    },
    headers: {
      'x-forwarded-host': h.get('x-forwarded-host') ?? undefined,
      'x-forwarded-proto': h.get('x-forwarded-proto') ?? undefined,
    },
  });
}