import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  if (!url || !anon) throw new Error('Supabase env vars ausentes.')

  return createServerClient(url, anon, {
    cookies: {
      get: (name: string) => cookies().get(name)?.value,
      set: (name: string, value: string, options: any) => {
        cookies().set(name, value, options)
      },
      remove: (name: string, options: any) => {
        cookies().set(name, '', { ...options, maxAge: 0 })
      }
    }
  })
}
