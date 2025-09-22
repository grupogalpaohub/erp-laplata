import { cookies, headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export function createSupabaseServerClient() {
  const authDisabled = process.env.AUTH_DISABLED === 'true' || process.env.AUTH_DISABLED === '1'
  
  // Se auth está desabilitada, usar service role para bypass RLS
  if (authDisabled && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gpjcfwjssfvqhppxdudp.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Verificar variáveis apenas quando auth não está desabilitada
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL/ANON ausentes. Verifique .env.local.');
  }

  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
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