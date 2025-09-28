import { redirect } from 'next/navigation'
import { supabaseServer } from '@/utils/supabase/server'

export async function requireSession(nextPath: string = '/dashboard') {
  const supabase = supabaseServer()
  const { data } = await supabase.auth.getUser()

  if (!data?.user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`)
  }

  return data.user
}