import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

export async function POST() {
  const supabase = supabaseServer();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true }, { status: 200 });
}