'use client'
import { useEffect } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    fetch('/api/auth/sync', { method: 'POST' })
      .then(() => fetch('/api/auth/refresh', { method: 'POST' }))
      .catch(() => {})
  }, [])
  return <>{children}</>
}
