import { supabaseServer } from '@/lib/supabase/server'

export async function ensureServerSession(req: Request) {
  const sb = supabaseServer()
  const { data } = await sb.auth.getUser()
  if (data?.user) return sb

  const authz = req.headers.get('authorization') || ''
  const access = authz.startsWith('Bearer ') ? authz.slice(7) : undefined
  const refresh = req.headers.get('x-refresh-token') || undefined
  if (access && refresh) {
    await sb.auth.setSession({ access_token: access, refresh_token: refresh })
  }
  return sb
}
