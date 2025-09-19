'use client'
import { useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function HashCallback() {
  useEffect(() => {
    const hash = window.location.hash
    const params = new URLSearchParams(hash.slice(1))
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')
    const next = new URLSearchParams(window.location.search).get('next') || '/'
    if (access_token) {
      const sb = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      sb.auth.setSession({ access_token, refresh_token: refresh_token || undefined }).then(() => {
        window.location.replace(next)
      })
    } else {
      window.location.replace('/login')
    }
  }, [])
  return <p style={{padding:16}}>Finalizando login…</p>
}
