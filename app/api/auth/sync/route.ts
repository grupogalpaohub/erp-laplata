import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  try {
    const { access_token, refresh_token } = await req.json();

    if (!access_token || !refresh_token) {
      return NextResponse.json({ ok: false, error: "missing tokens" }, { status: 400 });
    }

    // vamos construir a resposta desde já, para conseguir setar cookies nela
    const res = NextResponse.json({ ok: true });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          // lê cookies vindos do request
          get: (name) => req.cookies.get(name)?.value,
          // escreve/atualiza cookies no RESPONSE (essencial!)
          set: (name, value, options) => res.cookies.set(name, value, options),
          remove: (name, options) => res.cookies.set(name, "", options),
        },
      }
    );

    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 401 });
    }

    // cookies foram gravados em `res` pelo adapter acima
    return res;
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
