import { supabaseServer } from "@/utils/supabase/server";

export async function GET() {
  const sb = supabaseServer();
  const { data, error } = await sb.from("mm_material").select("*").limit(50);
  return Response.json({ ok: !error, items: data ?? [], error });
}