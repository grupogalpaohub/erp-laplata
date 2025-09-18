'use client'
import { useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
export default function Callback() {
  const router = useRouter()
  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase.auth.getSession().finally(() => router.replace('/'))
  }, [router])
  return <div>Processando login…</div>
}
