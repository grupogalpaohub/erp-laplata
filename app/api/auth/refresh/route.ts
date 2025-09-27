import { supabaseServer } from "@/utils/supabase/server";

export async function GET() {
  const supabase = supabaseServer(); // inicializa SSR + cookies (guardrail)
  // se precisar, valide sessão:
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return Response.json({ ok: false, error: error.message }, { status: 401 });
  return Response.json({ ok: true, session: !!session });
}