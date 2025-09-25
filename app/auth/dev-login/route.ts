// app/auth/dev-login/route.ts
import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Forbidden", { status: 403 });
  }
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;
  if (!email || !password) {
    return new NextResponse("Missing TEST_EMAIL/TEST_PASSWORD in env", { status: 400 });
  }
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return new NextResponse(error.message, { status: 401 });
  return NextResponse.json({ ok: true });
}
