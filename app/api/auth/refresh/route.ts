import { supabaseServer } from "@/utils/supabase/server";

async function exec() {
  const supabase = supabaseServer();
  const { data, error } = await supabase.auth.getSession();
  if (error) return Response.json({ ok: false, error: error.message }, { status: 401 });
  return Response.json({ ok: true, session: !!data.session });
}

export async function GET() { return exec(); }
export async function POST() { return exec(); }