import { supabaseServer } from "@/utils/supabase/server";

export async function GET() {
  const supabase = supabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  return Response.json({ ok: true, session });
}
