import { createClient } from '@supabase/supabase-js'

// Browser: APENAS variáveis NEXT_PUBLIC_*
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables (browser)')
}

// ✅ exporta FUNÇÃO para manter chamadas existentes: supabaseBrowser()
export const supabaseBrowser = () => createClient(supabaseUrl, supabaseAnonKey)
