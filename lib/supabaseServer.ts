import { cookies, headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { ENV } from '@/lib/env';

export const runtime = 'nodejs';

export function createSupabaseServerClient() {
  // Se auth está desabilitada, usar service role para bypass RLS
  if (ENV.AUTH_DISABLED && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createClient(
      ENV.SUPABASE_URL || 'https://gpjcfwjssfvqhppxdudp.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  // Verificar variáveis apenas quando auth não está desabilitada
  if (!ENV.SUPABASE_URL || !ENV.SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL/ANON ausentes. Verifique .env.local.');
  }

  const cookieStore = cookies();

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
  });
}