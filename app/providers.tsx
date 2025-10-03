'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/client'

async function syncOnce() {
  const sb = supabaseBrowser()
  const { data } = await sb.auth.getSession()
  const at = data.session?.access_token
  const rt = data.session?.refresh_token
  if (!at || !rt) return
  await fetch('/api/auth/sync', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${at}`, 'x-refresh-token': rt },
    body: JSON.stringify({ access_token: at, refresh_token: rt }),
  }).catch(() => {})
}

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const search = useSearchParams()
  const sb = supabaseBrowser()

  // Debounce simples para evitar múltiplos syncs concorrentes
  const busy = useRef(false)
  const doSync = async () => {
    if (busy.current) return
    busy.current = true
    try { await syncOnce() } finally { busy.current = false }
  }

  // 1) montar
  useEffect(() => { 
    // 🔒 não roda nada na callback
    if (pathname?.startsWith("/auth/")) return
    doSync() 
  }, [pathname])

  // 2) mudanças de auth
  useEffect(() => {
    // 🔒 não roda nada na callback
    if (pathname?.startsWith("/auth/")) return
    const { data: sub } = sb.auth.onAuthStateChange(() => { doSync() })
    return () => { sub.subscription.unsubscribe() }
  }, [sb, pathname])

  // 3) mudar de rota/query
  const searchString = search?.toString()
  useEffect(() => { 
    // 🔒 não roda nada na callback
    if (pathname?.startsWith("/auth/")) return
    doSync() 
  }, [pathname, searchString])

  // 4) voltar foco
  useEffect(() => {
    // 🔒 não roda nada na callback
    if (pathname?.startsWith("/auth/")) return
    const onVis = () => { if (document.visibilityState === 'visible') doSync() }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [pathname])

  return <>{children}</>
}
