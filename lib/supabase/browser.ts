import { createClient } from '@supabase/supabase-js'

let browserClient: ReturnType<typeof createClient> | undefined

export function supabaseBrowser() {
  if (!browserClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    browserClient = createClient(url, anon, { auth: { persistSession: true, storageKey: 'erp-laplata-auth' } })
  }
  return browserClient
}
