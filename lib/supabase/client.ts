import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
if (!url || !anon) throw new Error('Missing Supabase environment variables (browser)')

let browserClient: SupabaseClient | null = null
export const supabaseBrowser = () => (browserClient ??= createClient(url, anon))
