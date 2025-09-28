import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  // Usar helper para cumprir guardrail
  const sb = supabaseServer();
  
  return Response.json({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
    anonSet: !!(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY),
  });
}
