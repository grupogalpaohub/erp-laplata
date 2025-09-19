import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', process.env.NEXT_PUBLIC_SITE_URL));
  }

  const supabase = supabaseServer();

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL('/login?error=exchange_failed', process.env.NEXT_PUBLIC_SITE_URL));
  }

  return NextResponse.redirect(new URL(next, process.env.NEXT_PUBLIC_SITE_URL));
}