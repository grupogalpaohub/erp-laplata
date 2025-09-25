export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({ success: true })
    
    // Limpar todos os cookies de sessão do Supabase
    const cookies = req.cookies.getAll()
    cookies.forEach(cookie => {
      if (cookie.name.includes('sb-') || cookie.name.includes('supabase')) {
        response.cookies.delete(cookie.name)
      }
    })
    
    // Redirecionar para landing page
    response.headers.set('Location', '/landing')
    return new NextResponse(null, { status: 302, headers: response.headers })
  } catch (error) {
    console.error('Erro ao limpar sessão:', error)
    return NextResponse.json({ error: 'Erro ao limpar sessão' }, { status: 500 })
  }
}


