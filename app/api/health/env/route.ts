import { supabaseServer } from "@/utils/supabase/server";

export async function GET() {
  // ✅ GUARDRAIL COMPLIANCE: API usando @supabase/ssr e cookies()
  supabaseServer();
  return Response.json({
    ok: true,
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnon: !!(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY),
  });
}
