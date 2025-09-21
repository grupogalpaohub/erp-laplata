import { NextResponse } from 'next/server'
import { ENV } from '@/lib/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    AUTH_DISABLED: ENV.AUTH_DISABLED,
    SUPABASE_URL: ENV.SUPABASE_URL,
    SUPABASE_ANON_KEY: ENV.SUPABASE_ANON_KEY ? 'Present' : 'Missing',
    SITE_URL: ENV.SITE_URL,
    SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing',
    NODE_ENV: process.env.NODE_ENV
  })
}
