export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function GET() {
  try {
    const sb = createSupabaseServerClient()
    const { data: { user }, error } = await sb.auth.getUser()
    
    return NextResponse.json({
      ok: true,
      env: {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        site: process.env.NEXT_PUBLIC_SITE_URL || null,
        urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
        anonValue: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
        siteValue: process.env.NEXT_PUBLIC_SITE_URL || 'MISSING',
      },
      user: user ? { id: user.id, email: user.email } : null,
      error: error?.message || null,
      timestamp: new Date().toISOString()
    })
  } catch (e: any) {
    return NextResponse.json({ 
      ok: false, 
      error: String(e.message || e),
      env: {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        site: process.env.NEXT_PUBLIC_SITE_URL || null,
        urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
        anonValue: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
        siteValue: process.env.NEXT_PUBLIC_SITE_URL || 'MISSING',
      },
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

