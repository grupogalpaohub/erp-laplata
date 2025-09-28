import { NextResponse } from 'next/server'
import { supabaseServer } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const { access_token, refresh_token } = await req.json().catch(() => ({}))
    if (!access_token || !refresh_token) {
      return NextResponse.json({ ok: false, error: 'MISSING_TOKENS' }, { status: 400 })
    }
    const supabase = supabaseServer()
    const { data, error } = await supabase.auth.setSession({ access_token, refresh_token })
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 401 })
    return NextResponse.json({ ok: true, user: data.user ?? null })
  } catch {
    return NextResponse.json({ ok: false, error: 'SYNC_ERROR' }, { status: 500 })
  }
}
