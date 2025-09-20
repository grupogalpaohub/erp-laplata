// frontend/src/app/api/_debug/cookies/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const cookies = req.cookies.getAll()
  const filtered = cookies.filter(c => c.name.includes('sb-') || c.name.includes('auth'))
  return NextResponse.json({ cookies: filtered })
}
