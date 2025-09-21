'use client';
import { createClient } from '@supabase/supabase-js';
import { ENV } from '../env';

export const supabaseClient = createClient(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true } }
);

// Manter compatibilidade com código existente
export const supabaseBrowser = supabaseClient;