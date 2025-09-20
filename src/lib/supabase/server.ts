export const runtime = 'nodejs'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

/**
 * Server-side Supabase client using cookies() to forward the user session.
 * Use em Server Components e Route Handlers.
 */
export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: () => cookies() }
  )
}

/**
 * Backward-compatible alias used em vários arquivos legados.
 * Mantém o mesmo comportamento do createClient().
 */
export function supabaseServer() {
  return createClient()
}