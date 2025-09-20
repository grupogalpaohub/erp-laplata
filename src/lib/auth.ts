import { cookies } from 'next/headers'
export function hasSession(): boolean {
  const c = cookies()
  return c.has('sb-access-token') || c.has('sb:token') || c.has('supabase-auth-token')
}
