'use client'
import { useEffect } from 'react'
import { supabaseBrowser } from '@/lib/supabase/client'

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const supabase = supabaseBrowser()

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      // informa o servidor para setar/limpar cookies httpOnly
      try {
        await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, session }),
        })
      } catch {}
    })

    return () => sub?.subscription?.unsubscribe?.()
  }, [])

  return <>{children}</>
}
