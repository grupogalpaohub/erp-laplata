// lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js';

export function supabaseServer() {
  // Somente no server! (não exportar para o browser)
  const url = process.env.SUPABASE_URL!;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, service);
}