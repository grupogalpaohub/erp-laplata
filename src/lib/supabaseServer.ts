import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function supabaseServer() {
  // Valores hardcoded temporariamente para resolver problema de build
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gpjcfwjssfvqhppxdudp.supabase.co'
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwamNmd2pzc2Z2cWhwcHhkdWRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDQyOTUsImV4cCI6MjA3MzUyMDI5NX0.6h6ogP8aMCvy7fUNN1mbxSK-O0TbGiEIP5rO5z0s0r0'
  
  // Debug: log das variáveis de ambiente
  console.log('[supabaseServer] NEXT_PUBLIC_SUPABASE_URL:', url ? 'EXISTS' : 'MISSING')
  console.log('[supabaseServer] NEXT_PUBLIC_SUPABASE_ANON_KEY:', anon ? 'EXISTS' : 'MISSING')
  
  if (!url || !anon) {
    console.error('[supabaseServer] Missing environment variables:', {
      url: !!url,
      anon: !!anon,
      allEnvKeys: Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_'))
    })
    throw new Error('Supabase env ausente: NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não definidas')
  }

  const cookieStore = cookies()
  
  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
