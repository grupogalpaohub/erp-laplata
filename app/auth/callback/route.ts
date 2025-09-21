import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/src/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = url.searchParams.get('next') || '/';
  const supabase = createSupabaseServerClient();
  await supabase.auth.getSession(); // hidrata sessão/cookies
  return NextResponse.redirect(new URL(next, url.origin));
}
