import { createServerClient } from '@supabase/ssr'
import { NextRequest } from 'next/server'

export function supabaseMiddleware(req: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: () => {
          // Não fazer nada no middleware - apenas ler
        },
        remove: () => {
          // Não fazer nada no middleware - apenas ler
        }
      }
    }
  )
}
