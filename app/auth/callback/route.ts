import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = url.searchParams.get('next') || '/';
  
  // Se tem code, processa no servidor
  if (url.searchParams.get('code')) {
    // Redireciona para a página client para processar o code
    return NextResponse.redirect(new URL(`/auth/callback?next=${encodeURIComponent(next)}`, url.origin));
  }
  
  // Se não tem code, vai direto para home
  return NextResponse.redirect(new URL(next, url.origin));
}