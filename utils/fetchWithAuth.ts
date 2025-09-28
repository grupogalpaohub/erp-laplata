'use client'
import { getClientTokens } from '@/utils/auth/clientTokens'

export async function fetchWithAuth(input: RequestInfo | URL, init: RequestInit = {}) {
  const { access, refresh } = await getClientTokens()
  const headers = new Headers(init.headers || {})
  if (access) headers.set('Authorization', `Bearer ${access}`)
  if (refresh) headers.set('x-refresh-token', refresh)
  return fetch(input, { ...init, headers, credentials: 'include' })
}
