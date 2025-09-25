import { NextResponse } from 'next/server';
import { ENV } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const masked = (s: string) => (s && s.length > 8 ? s.slice(0, 4) + '...' + s.slice(-4) : s || '<vazio>');
  return NextResponse.json({
    NEXT_PUBLIC_SUPABASE_URL: ENV.SUPABASE_URL || '<vazio>',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: masked(ENV.SUPABASE_ANON_KEY),
    NEXT_PUBLIC_SITE_URL: ENV.SITE_URL || '<vazio>',
    VERCEL_ENV: ENV.VERCEL_ENV,
    cwd: process.cwd(),
  });
}

