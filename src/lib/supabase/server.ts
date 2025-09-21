import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

// Cache para evitar recriação desnecessária (otimização para plano free)
let cachedClient: ReturnType<typeof createServerClient> | null = null
let lastEnvCheck = 0
const ENV_CACHE_DURATION = 30000 // 30 segundos

function getEnvVars() {
  const now = Date.now()
  
  // Cache das variáveis de ambiente para evitar verificações desnecessárias
  if (cachedClient && (now - lastEnvCheck) < ENV_CACHE_DURATION) {
    return cachedClient
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    // Fallback para desenvolvimento local (otimização para plano free)
    const fallbackUrl = 'https://gpjcfwjssfvqhppxdudp.supabase.co'
    const fallbackAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwamNmd2pzc2Z2cWhwcHhkdWRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDQyOTUsImV4cCI6MjA3MzUyMDI5NX0.6h6ogP8aMCvy7fUNN1mbxSK-O0TbGiEIP5rO5z0s0r0'
    
    console.warn('[supabaseServer] Using fallback credentials for development')
    
    const cookieStore = cookies()
    cachedClient = createServerClient(fallbackUrl, fallbackAnon, {
      cookies: {
        getAll() { return cookieStore.getAll() },
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
  } else {
    const cookieStore = cookies()
    cachedClient = createServerClient(url, anon, {
      cookies: {
        getAll() { return cookieStore.getAll() },
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

  lastEnvCheck = now
  return cachedClient
}

// Função principal otimizada
export function supabaseServer() {
  return getEnvVars()
}

// Alias para compatibilidade com código existente
export function createClient() {
  return getEnvVars()
}