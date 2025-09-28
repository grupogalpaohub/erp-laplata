// app/api/auth/sync/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const cookieStore = cookies()
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
  const { access_token, refresh_token } = await req.json();

  // Carrega os tokens no cliente SSR (ele setará os cookies httpOnly)
  if (access_token) await sb.auth.setSession({ access_token, refresh_token });

  // força leitura para garantir persistência
  const { data } = await sb.auth.getSession();

  return NextResponse.json({ ok: true, hasSession: !!data.session });
}
