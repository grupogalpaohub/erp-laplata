import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function supabaseServerReadOnly() {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: () => {
          // Não modificar cookies - apenas ler
        },
        remove: () => {
          // Não modificar cookies - apenas ler
        }
      }
    }
  )
}
