'use client';

import { createBrowserClient } from '@supabase/ssr';

// Em client, use sempre as variáveis NEXT_PUBLIC_*
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cria o cliente por chamada (sem singletons com estado compartilhado)
export function supabaseBrowser() {
  if (!URL || !ANON) {
    throw new Error('Supabase client: envs ausentes no browser (NEXT_PUBLIC_SUPABASE_URL/ANON_KEY)');
  }
  return createBrowserClient(URL, ANON);
}

export default supabaseBrowser;