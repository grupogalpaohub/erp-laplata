'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

async function syncOnce() {
  try {
    await fetch('/api/auth/sync', { method: 'POST', credentials: 'include' })
    await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
  } catch {}
}

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const search = useSearchParams()

  // 1) Ao montar
  useEffect(() => { syncOnce() }, [])

  // 2) Ao mudar de rota (pathname ou query)
  useEffect(() => { syncOnce() }, [pathname, search?.toString()])

  // 3) Ao voltar o foco na aba
  useEffect(() => {
    const onVis = () => { if (document.visibilityState === 'visible') syncOnce() }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // 4) Heartbeat a cada 15 min (mantém sessão viva no servidor)
  useEffect(() => {
    const id = setInterval(syncOnce, 15 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  return <>{children}</>
}
