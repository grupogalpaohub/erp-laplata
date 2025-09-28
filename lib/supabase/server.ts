import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const supabaseServer = () => {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Ignore errors in server components
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 })
          } catch {
            // Ignore errors in server components
          }
        },
      },
    }
  )
}

// Manter compatibilidade com código existente
export const getSupabaseServerClient = supabaseServer
export const getServerSupabase = supabaseServer