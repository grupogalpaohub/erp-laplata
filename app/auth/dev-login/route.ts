import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");
    if (!email || !password) {
      console.error("DEV-LOGIN: Missing email/password");
      return NextResponse.json({ error: "Missing email/password" }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("DEV-LOGIN ERROR:", { msg: error.message, email });
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.log("DEV-LOGIN OK:", { email: data.user.email });
    return NextResponse.json({ user: data.user }, { status: 200 });
  } catch (e: any) {
    console.error("DEV-LOGIN FATAL:", e?.message || e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}