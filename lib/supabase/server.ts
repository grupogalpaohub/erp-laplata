import { createClient } from '@supabase/supabase-js'
// Server: usar variáveis server-only (não NEXT_PUBLIC) se disponíveis, caso
// contrário cair nas públicas. Nunca usar SERVICE_ROLE aqui a menos que esteja
// dentro de /app/api/** e com uso estritamente server-side.
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables (server)');
}
export const supabaseServer = () => {
  return createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: { persistSession: false }
  })
}

// Manter compatibilidade com código existente
export const getSupabaseServerClient = supabaseServer
export const getServerSupabase = supabaseServer