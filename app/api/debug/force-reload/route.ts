import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  // Força reload das variáveis
  delete require.cache[require.resolve('dotenv')]
  const dotenv = require('dotenv')
  dotenv.config({ path: '.env.local' })
  
  return NextResponse.json({
    AUTH_DISABLED: process.env.NEXT_PUBLIC_AUTH_DISABLED,
    SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing',
    all_env: Object.keys(process.env).filter(k => k.includes('AUTH') || k.includes('SERVICE'))
  })
}
