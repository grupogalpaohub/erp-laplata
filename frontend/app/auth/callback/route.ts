// app/auth/callback/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Só redireciona para a Home; o supabase-js grava o token no client
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL ?? 'https://erp-laplata.vercel.app'));
}