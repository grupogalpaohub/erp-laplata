// app/api/auth/sync/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const sb = supabaseServer();
  const { access_token, refresh_token } = await req.json();

  // Carrega os tokens no cliente SSR (ele setará os cookies httpOnly)
  if (access_token) await sb.auth.setSession({ access_token, refresh_token });

  // força leitura para garantir persistência
  const { data } = await sb.auth.getSession();

  return NextResponse.json({ ok: true, hasSession: !!data.session });
}
