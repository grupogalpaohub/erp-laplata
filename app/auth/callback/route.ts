import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = url.searchParams.get('next') || '/';
  
  
  // Sempre redireciona para a página client
  return NextResponse.redirect(new URL(`/auth/callback?next=${encodeURIComponent(next)}`, url.origin));
}

