import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { ENV } from '../env';

export const runtime = 'nodejs';

export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: '', ...options });
      },
    },
  });
}

// Manter compatibilidade com código existente
export const supabaseServer = createSupabaseServerClient;
export const createClient = createSupabaseServerClient;