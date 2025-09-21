import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'experimental-edge';
export const config = {
  matcher: ['/((?!_next|assets|public|favicon.ico|api|auth).*)'],
};

const PUBLIC = new Set(['/', '/login']);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC.has(pathname)) return NextResponse.next();

  // Por enquanto, deixa passar tudo para testar
  return NextResponse.next();
}