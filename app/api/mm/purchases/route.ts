// app/api/mm/purchases/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const sb = supabaseServer();

  const po = {
    po_id: body.po_id, // ou gere no DB
    vendor_id: body.vendor_id ?? null,
    status: body.status ?? "draft",
    created_date: body.created_date ?? new Date().toISOString().slice(0,10),
  };

  const { data, error } = await sb.from("mm_purchase_order").insert(po).select("*").single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, po: data }, { status: 201 });
}
