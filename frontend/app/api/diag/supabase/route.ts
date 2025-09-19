import { NextResponse } from "next/server";
import { supabaseServer } from "@/src/lib/supabase/server";

export async function GET() {
  try {
    const envOK = {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };
    const sb = supabaseServer();
    const { count, error } = await sb
      .from("mm_material")
      .select("tenant_id", { head: true, count: "exact" })
      .limit(1);

    return NextResponse.json({ envOK, query: { count, error: error?.message ?? null } });
  } catch (e: any) {
    return NextResponse.json({ fatal: e?.message ?? String(e) }, { status: 500 });
  }
}
