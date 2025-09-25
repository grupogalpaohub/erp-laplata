
// ============================================================================
// 🔒 REGRAS IRREVERSÍVEIS - NÃO ALTERAR
// ============================================================================
// ❌ PROIBIDO: Hardcode de tenant (LaplataLunaria, etc.)
// ❌ PROIBIDO: process.env.TENANT_ID (não existe)
// ❌ PROIBIDO: Alterar .env.local
// ❌ PROIBIDO: Desabilitar RLS
// ❌ PROIBIDO: SERVICE_ROLE_KEY no frontend
// ✅ OBRIGATÓRIO: Usar NEXT_PUBLIC_AUTH_DISABLED
// ✅ OBRIGATÓRIO: Investigação profunda antes de corrigir
// ============================================================================
// lib/supabase/server.ts
import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { ENV } from '@/lib/env';

export function getSupabaseServer() {
  // Se auth está desabilitada, usar service role para bypass RLS
  if ((ENV.AUTH_DISABLED || process.env.NEXT_PUBLIC_AUTH_DISABLED === 'true') && ENV.SERVICE_ROLE_KEY) {
    return createClient(
      ENV.SUPABASE_URL || 'https://gpjcfwjssfvqhppxdudp.supabase.co',
      ENV.SERVICE_ROLE_KEY
    );
  }

  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => cookieStore.get(key)?.value,
        // set/remove mantidos vazios para SSR; não precisamos mutá-los aqui
        set: () => {},
        remove: () => {},
      },
    },
  );
}
