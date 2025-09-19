import { NextResponse } from 'next/server'
import { supabaseServer } from '@/src/lib/supabase/server'

export async function GET() {
  const sb = await supabaseServer()

  const [{ data: user }, { data: session }] = await Promise.all([
    sb.auth.getUser(),
    sb.auth.getSession(),
  ])

  return NextResponse.json({
    ok: true,
    user: user?.user ?? null,
    session: session?.session ?? null,
  })
}
