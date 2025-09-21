import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // se algum provedor vier com ?code e você preferir tratar no server no futuro,
  // pode implementar aqui. Por ora, a página client já resolve os dois cenários.
  const url = new URL(req.url);
  const next = url.searchParams.get('next') || '/';
  // manter no mesmo host/origin
  return NextResponse.redirect(new URL(`/auth/callback?next=${encodeURIComponent(next)}`, url.origin));
}