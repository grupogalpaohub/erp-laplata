import { supabaseServer } from '@/lib/supabase/server'

export async function getSession() {
  const sb = supabaseServer()
  const { data } = await sb.auth.getSession()
  return data.session ?? null
}

export async function getUser() {
  const sb = supabaseServer()
  const { data } = await sb.auth.getUser()
  return data.user ?? null
}
