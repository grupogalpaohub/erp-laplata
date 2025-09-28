'use client'

import { useEffect } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Primeiro sync, depois refresh
    fetch('/api/auth/sync', { method: 'POST' })
      .then(() => fetch('/api/auth/refresh', { method: 'POST' }))
      .catch(() => {})
  }, [])

  return <>{children}</>
}
