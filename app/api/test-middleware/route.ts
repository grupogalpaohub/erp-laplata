import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const cookies = req.cookies.getAll()
  
  // Simular lógica do middleware
  const hasSupabaseSession = cookies.some(cookie => {
    const name = cookie.name
    const value = cookie.value
    
    const isSupabaseCookie = (
      (name.includes('sb-') && name.includes('auth-token')) ||
      (name.includes('sb-') && name.includes('.0')) ||
      (name.includes('sb-') && name.includes('.1')) ||
      (name === 'sb-access-token') ||
      (name === 'sb-refresh-token')
    )
    
    const hasValidValue = value && 
      value !== '[]' && 
      value !== 'null' && 
      value !== 'undefined' &&
      value !== '' &&
      value.length > 10
    
    return isSupabaseCookie && hasValidValue
  })

  return NextResponse.json({
    pathname,
    cookies: cookies.map(c => ({ 
      name: c.name, 
      value: c.value?.substring(0, 20) + '...',
      length: c.value?.length || 0
    })),
    hasSupabaseSession,
    shouldRedirect: !hasSupabaseSession,
    timestamp: new Date().toISOString()
  })
}
