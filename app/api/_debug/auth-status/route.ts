import { NextResponse } from 'next/server'
import { supabaseServer } from '@/src/lib/supabase/server'
export async function GET() {
  const sb = supabaseServer()
  const [user, session] = await Promise.all([
    sb.auth.getUser(),
    sb.auth.getSession()
  ])
  return NextResponse.json({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    user: user.data?.user ?? null,
    session: session.data?.session ? { expires_at: session.data.session.expires_at } : null
  })
}
