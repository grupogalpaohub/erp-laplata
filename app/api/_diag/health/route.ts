import { NextResponse } from 'next/server'
import { supabaseServer } from '@/src/lib/supabase/server'

export async function GET() {
  try {
    const sb = supabaseServer()
    const { data: pong } = await sb.rpc('pg_sleep', { seconds: 0 }).catch(() => ({ data: 'ok' }))
    return NextResponse.json({
      ok: true,
      env: {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      },
      pong: !!pong
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 })
  }
}
