import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { isAllowedTenant } from "@/utils/tenant";

export async function POST(req: Request) {
  const sb = supabaseServer();
  const form = await req.formData();
  const tenant = String(form.get("tenant_id") || "");

  if (!isAllowedTenant(tenant)) {
    return NextResponse.json({ ok: false, error: { message: "Invalid tenant" } }, { status: 400 });
  }

  const { data: { user }, error: userErr } = await sb.auth.getUser();
  if (userErr || !user) {
    return NextResponse.json({ ok: false, error: { message: "Not authenticated" } }, { status: 401 });
  }

  const { error: updErr } = await sb.auth.updateUser({ data: { tenant_id: tenant } });
  if (updErr) {
    return NextResponse.json({ ok: false, error: { message: updErr.message } }, { status: 400 });
  }

  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL));
}