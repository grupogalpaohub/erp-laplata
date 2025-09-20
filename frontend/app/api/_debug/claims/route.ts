export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { supabaseServer } from '@/src/lib/supabase/server'

export async function GET() {
  const sb = supabaseServer()
  const { data: { session } } = await sb.auth.getSession()
  const token = session?.access_token
  let claims: any = null
  if (token) {
    const [, payload] = token.split('.')
    try { claims = JSON.parse(Buffer.from(payload, 'base64').toString('utf8')) } catch {}
  }
  return NextResponse.json({
    hasSession: !!session,
    user: session?.user ? { id: session.user.id, email: session.user.email } : null,
    claims
  })
}