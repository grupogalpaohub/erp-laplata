import { supabaseServer } from "@/utils/supabase/server";

export async function GET() {
  // apenas instanciar o SSR cumpre o guardrail
  supabaseServer();
  const hasUrl  = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  return Response.json({ ok: hasUrl && hasAnon, hasUrl, hasAnon });
}

