import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const s = await supabaseServer().auth.getSession();
  const unauth = !s.data.session;
  return Response.json({ ok: true, unauth });
}
