import { supabaseBrowser } from '@/utils/supabase/browser'

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const supabase = supabaseBrowser()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    throw new Error('Not authenticated')
  }
  
  const headers = new Headers(options.headers)
  headers.set('Authorization', `Bearer ${session.access_token}`)
  headers.set('x-refresh-token', session.refresh_token)
  
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  })
}
