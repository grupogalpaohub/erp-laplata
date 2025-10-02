import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

let serverClient: ReturnType<typeof createServerClient> | undefined

export function supabaseServer() {
  if (!serverClient) {
    const cookieStore = cookies()
    serverClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookie = cookieStore.get(name)
            if (!cookie) return undefined
            
            // Se for o cookie de auth, precisa extrair o valor correto
            if (name === 'supabase-auth-token' && cookie.value) {
              try {
                // O cookie está em formato JSON stringificado
                const parsed = JSON.parse(cookie.value)
                if (Array.isArray(parsed) && parsed[0]) {
                  return parsed[0]
                }
                return cookie.value
              } catch {
                return cookie.value
              }
            }
            
            return cookie.value
          },
          set(name: string, value: string, options: any) {
            // No-op para server components
            // Cookies são gerenciados pelo cliente
          },
          remove(name: string, options: any) {
            // No-op para server components
            // Cookies são gerenciados pelo cliente
          },
        },
      }
    )
  }
  return serverClient
}