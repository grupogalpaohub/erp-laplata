// app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

export async function GET() {
  const sb = supabaseServer();
  const { data } = await sb.auth.getSession();
  return NextResponse.json({ ok: true, session: !!data.session });
}
