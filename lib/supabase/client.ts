import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Browser: APENAS variáveis NEXT_PUBLIC_*
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables (browser)')
}

// singleton para evitar "Multiple GoTrueClient instances"
let browserClient: SupabaseClient | null = null

export const supabaseBrowser = () => {
  if (!browserClient) {
    browserClient = createClient(supabaseUrl!, supabaseAnonKey!)
  }
  return browserClient
}
