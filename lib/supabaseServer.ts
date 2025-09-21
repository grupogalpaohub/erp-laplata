import { ENV } from '@/lib/env';
import { cookies, headers } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export const runtime = 'nodejs';

export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
    headers: {
      'x-forwarded-host': headers().get('x-forwarded-host') ?? undefined,
      'x-forwarded-proto': headers().get('x-forwarded-proto') ?? undefined,
    },
  });
}
