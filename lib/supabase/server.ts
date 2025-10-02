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
            return cookieStore.get(name)?.value
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