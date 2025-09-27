import { createClient } from '@supabase/supabase-js'
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
if (!url || !anon) throw new Error('Missing Supabase environment variables (server)')
export const supabaseServer = () => createClient(url, anon, { auth: { persistSession: false } })

// Manter compatibilidade com código existente
export const getSupabaseServerClient = supabaseServer
export const getServerSupabase = supabaseServer