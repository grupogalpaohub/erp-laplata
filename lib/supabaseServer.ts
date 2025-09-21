import { ENV } from '@/lib/env';
import { cookies, headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export const runtime = 'nodejs';

export function createSupabaseServerClient() {
  if (!ENV.SUPABASE_URL || !ENV.SUPABASE_ANON_KEY) {
    throw new Error(
      `Supabase URL/ANON ausentes. Lidas em runtime:\n` +
      `  NEXT_PUBLIC_SUPABASE_URL = ${ENV.SUPABASE_URL || '<vazio>'}\n` +
      `  NEXT_PUBLIC_SUPABASE_ANON_KEY = ${ENV.SUPABASE_ANON_KEY ? '<presente>' : '<vazio>'}\n` +
      `  NEXT_PUBLIC_SITE_URL = ${ENV.SITE_URL || '<vazio>'}\n`
    );
  }
  const cookieStore = cookies();
  return createServerClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
    cookies: {
      get: (n: string) => cookieStore.get(n)?.value,
      set: (n: string, v: string, options: any) => cookieStore.set(n, v, options),
      remove: (n: string, options: any) => cookieStore.set(n, '', { ...options, maxAge: 0 }),
    },
    headers: {
      'x-forwarded-host': headers().get('x-forwarded-host') ?? undefined,
      'x-forwarded-proto': headers().get('x-forwarded-proto') ?? undefined,
    },
  });
}