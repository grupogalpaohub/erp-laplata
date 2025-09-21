import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const envPath = join(process.cwd(), '.env.local')
    const envContent = readFileSync(envPath, 'utf8')
    
    const lines = envContent.split('\n').filter(line => line.trim())
    const envVars = lines.map(line => {
      const [key, ...valueParts] = line.split('=')
      return { key: key?.trim(), value: valueParts.join('=').trim() }
    })
    
    return NextResponse.json({
      fileExists: true,
      content: envVars,
      authDisabled: envVars.find(v => v.key === 'NEXT_PUBLIC_AUTH_DISABLED')?.value,
      serviceKey: envVars.find(v => v.key === 'SUPABASE_SERVICE_ROLE_KEY')?.value
    })
  } catch (error) {
    return NextResponse.json({
      fileExists: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
