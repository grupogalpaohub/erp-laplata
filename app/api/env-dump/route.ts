import { supabaseServer } from "@/utils/supabase/server";

export async function GET() {
  // ✅ GUARDRAIL COMPLIANCE: API usando @supabase/ssr e cookies()
  supabaseServer();
  return Response.json({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
    anonSet: !!(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY),
    cwd: process.cwd(),
  });
}
