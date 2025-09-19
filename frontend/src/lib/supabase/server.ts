import { cookies, headers } from 'next/headers'
import { createServerClient as createSSRClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'

export async function createServerClient() {
  const cookieStore = await cookies()
  const h = await headers()
  return createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options: CookieOptions) => cookieStore.set({ name, value, ...options }),
        remove: (name, options: CookieOptions) => cookieStore.set({ name, value: '', ...options, maxAge: 0 })
      },
      headers: {
        'x-forwarded-for': h.get('x-forwarded-for') ?? '',
        'user-agent': h.get('user-agent') ?? '',
        'x-forwarded-host': h.get('x-forwarded-host') ?? ''
      }
    }
  )
}
export async function supabaseServer(){ return createServerClient() }