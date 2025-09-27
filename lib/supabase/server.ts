import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
if (!url || !anon) throw new Error('Missing Supabase environment variables (server)')

export const supabaseServer = () => {
  const cookieStore = cookies()
  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        // Cookies só podem ser setados em Route Handlers ou Server Actions
        // Aqui apenas lemos
      },
      remove(name: string, options: any) {
        // Cookies só podem ser removidos em Route Handlers ou Server Actions
        // Aqui apenas lemos
      },
    },
  })
}

// Manter compatibilidade com código existente
export const getSupabaseServerClient = supabaseServer
export const getServerSupabase = supabaseServer