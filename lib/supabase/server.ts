import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SUPABASE_URL, SUPABASE_ANON } from '@/src/env'

export const supabaseServer = () => {
  const cookieStore = cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
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