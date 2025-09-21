import { NextResponse } from 'next/server';
import { ENV } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = url.searchParams.get('next') || '/';
  const redirectTo = `${ENV.SITE_URL}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`;
  return NextResponse.json({
    SITE_URL: ENV.SITE_URL,
    computed_redirectTo: redirectTo,
  });
}
