import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getServerSupabase();
  const { data, error } = await supabase.from("mm_material").select("mm_material").limit(1);
  if (error) return NextResponse.json({ ok:false, error:error.message }, { status: 500 });
  return NextResponse.json({ ok:true, sample:data });
}
