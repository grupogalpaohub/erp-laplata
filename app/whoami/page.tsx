'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'
export default function WhoAmI() {
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    const s = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    s.auth.getUser().then(({ data }) => setUser(data.user ?? null))
  }, [])
  return <pre className="p-6">{JSON.stringify({ user }, null, 2)}</pre>
}
