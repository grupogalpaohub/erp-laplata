import { NextResponse } from 'next/server'
import { supabaseServer } from '@/src/lib/supabase/server'

export async function POST() {
  try {
    const sb = supabaseServer()
    await sb.auth.signOut()
    
    return NextResponse.json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ success: false, error: 'Logout failed' }, { status: 500 })
  }
}
