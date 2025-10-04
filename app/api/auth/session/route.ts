import { supabaseServer } from "@/lib/supabase/server";

// Forçar Node.js runtime para APIs que usam Supabase
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const supabase = supabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  return Response.json({ ok: true, session });
}
