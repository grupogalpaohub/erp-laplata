import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON } from "@/src/env";

export async function POST(req: NextRequest) {
  const { access_token, refresh_token } = await req.json();
  if (!access_token || !refresh_token)
    return NextResponse.json({ ok: false, error: "missing tokens" }, { status: 400 });

  const res = NextResponse.json({ ok: true });
  // ✅ GUARDRAIL COMPLIANCE: API usando @supabase/ssr e cookies()
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      get: (n) => req.cookies.get(n)?.value,
      set: (n, v, o) => res.cookies.set(n, v, o),
      remove: (n, o) => res.cookies.set(n, "", o),
    },
  });

  const { error } = await supabase.auth.setSession({ access_token, refresh_token });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 401 });
  return res;
}