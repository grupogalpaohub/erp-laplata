import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON } from '@/src/env'

let browserClient: SupabaseClient | null = null
export const supabaseBrowser = () => (browserClient ??= createClient(SUPABASE_URL, SUPABASE_ANON))
