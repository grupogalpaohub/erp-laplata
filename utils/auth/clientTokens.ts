'use client'
import { supabaseBrowser } from '@/utils/supabase/browser'

export async function getClientTokens() {
  const sb = supabaseBrowser()
  const { data } = await sb.auth.getSession()
  return {
    access: data.session?.access_token ?? null,
    refresh: data.session?.refresh_token ?? null,
  }
}
