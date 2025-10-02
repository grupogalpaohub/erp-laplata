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
  useEffect(() => { doSync() }, [])

  // 2) mudanças de auth
  useEffect(() => {
    const { data: sub } = sb.auth.onAuthStateChange(() => { doSync() })
    return () => { sub.subscription.unsubscribe() }
  }, [sb])

  // 3) mudar de rota/query
  useEffect(() => { doSync() }, [pathname, search?.toString()])

  // 4) voltar foco
  useEffect(() => {
    const onVis = () => { if (document.visibilityState === 'visible') doSync() }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return <>{children}</>
}
