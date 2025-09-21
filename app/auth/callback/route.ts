import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = url.searchParams.get('next') || '/';
  
  // Hidratar a sessão para que os cookies sejam salvos
  const supabase = createSupabaseServerClient();
  await supabase.auth.getSession();
  
  return NextResponse.redirect(new URL(next, url.origin));
}