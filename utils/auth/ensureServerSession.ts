import { supabaseServer } from '@/utils/supabase/server'

export async function ensureServerSession(req: Request) {
  const supabase = supabaseServer()
  const { data } = await supabase.auth.getUser()
  if (data?.user) return supabase

  // fallback: cria sessão com tokens vindos do browser
  const authz = req.headers.get('authorization') || ''
  const access = authz.startsWith('Bearer ') ? authz.slice(7) : null
  const refresh = req.headers.get('x-refresh-token')
  if (access && refresh) {
    const { error } = await supabase.auth.setSession({ access_token: access, refresh_token: refresh! })
    if (!error) return supabase
  }
  return supabase  // volta mesmo assim; quem chamar decide 401
}
