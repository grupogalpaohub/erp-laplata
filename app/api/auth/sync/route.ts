import { supabaseServer } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { access_token, refresh_token } = await req.json();

    if (!access_token || !refresh_token) {
      return Response.json({ ok: false, error: "missing tokens" }, { status: 400 });
    }

    const supabase = supabaseServer();
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) return Response.json({ ok: false, error: error.message }, { status: 401 });
    return Response.json({ ok: true, user: data.user ?? null });
  } catch (e: any) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
