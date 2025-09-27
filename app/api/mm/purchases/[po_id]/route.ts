// app/api/mm/purchases/[po_id]/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: { po_id: string } }) {
  const sb = supabaseServer();
  const { data, error } = await sb.from("mm_purchase_order").select("*").eq("po_id", params.po_id).single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 404 });
  return NextResponse.json({ ok:true, po: data });
}

export async function PATCH(req: Request, { params }: { params: { po_id: string } }) {
  const patch = await req.json().catch(() => ({}));
  const sb = supabaseServer();

  const { data, error } = await sb.from("mm_purchase_order").update(patch).eq("po_id", params.po_id).select("*").single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, po: data });
}
