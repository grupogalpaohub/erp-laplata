import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const env = {
    NEXT_PUBLIC_SITE_URL: !!process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NODE_ENV: process.env.NODE_ENV ?? null,
  };

  return NextResponse.json({
    ok: true,
    hint: 'Se NEXT_PUBLIC_SITE_URL estiver false no Preview, tudo bem — usamos o host automaticamente.',
    env,
    now: new Date().toISOString(),
  });
}
