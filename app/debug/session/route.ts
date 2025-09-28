import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
export const runtime = "nodejs";

export async function GET() {
  const supabase = supabaseServer();
  const { data, error } = await supabase.auth.getUser();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ user: data.user ?? null });
}