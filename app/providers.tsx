'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { supabaseBrowser } from '@/utils/supabase/browser'

async function pushSession() {
  try {
    const supabase = supabaseBrowser()
    const { data } = await supabase.auth.getSession()
    const at = data.session?.access_token
    const rt = data.session?.refresh_token
    if (!at || !rt) return
    await fetch('/api/auth/sync', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: at, refresh_token: rt }),
    })
  } catch {}
}

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const search = useSearchParams()
  const supabase = supabaseBrowser()

  // 1) Ao montar
  useEffect(() => { pushSession() }, [])

  // 2) Em toda mudança de auth
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(() => { pushSession() })
    return () => { sub.subscription.unsubscribe() }
  }, [supabase])

  // 3) Ao mudar de rota/query
  useEffect(() => { pushSession() }, [pathname, search?.toString()])

  // 4) Ao voltar o foco
  useEffect(() => {
    const onVis = () => { if (document.visibilityState === 'visible') pushSession() }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return <>{children}</>
}
