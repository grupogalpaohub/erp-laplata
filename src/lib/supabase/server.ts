import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

function required(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`[ENV] Missing ${name}. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no Vercel.`)
  }
  return value
}

export function supabaseServer() {
  const url  = required('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL)
  const anon = required('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const cookieStore = cookies()
  return createServerClient(url, anon, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      set() { /* Next SSR: o próprio framework persistirá */ },
      remove() { /* idem */ }
    }
  })
}