'use client'
import { useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
export default function Callback() {
  const router = useRouter()
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
    const supabase = createClient(supabaseUrl, supabaseKey)
    supabase.auth.getSession().finally(() => router.replace('/'))
  }, [router])
  return <div>Processando login…</div>
}
