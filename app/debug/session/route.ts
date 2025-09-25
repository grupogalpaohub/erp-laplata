// app/debug/session/route.ts
import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return NextResponse.json({ user: data.user ?? null });
}
