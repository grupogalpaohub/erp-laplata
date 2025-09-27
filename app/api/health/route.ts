import { supabaseServer } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = supabaseServer();
    const { error } = await supabase
      .from("user_profile")
      .select("user_id", { head: true, count: "exact" })
      .limit(1);

    // Se não autenticado (RLS), ainda é um "ok" de infra
    if (error) {
      return Response.json({ ok: true, unauth: true, note: "RLS blocked (no cookie)" });
    }
    return Response.json({ ok: true, unauth: false });
  } catch (e: any) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}