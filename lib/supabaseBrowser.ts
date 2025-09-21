'use client';
import { createBrowserClient } from '@supabase/ssr';
import { ENV } from '@/lib/env';

export function createSupabaseBrowserClient() {
  if (!ENV.SUPABASE_URL || !ENV.SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL/ANON ausentes (browser). Verifique .env.local.');
  }
  return createBrowserClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
}
