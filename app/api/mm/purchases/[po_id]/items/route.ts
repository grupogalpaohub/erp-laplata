// app/api/mm/purchases/[po_id]/items/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { toCents } from "@/lib/money";

export async function GET(_: Request, { params }: { params: { po_id: string } }) {
  const sb = supabaseServer();
  const { data, error } = await sb.from("mm_purchase_order_item").select("*").eq("po_id", params.po_id).order("item_no");
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, items: data });
}

export async function POST(req: Request, { params }: { params: { po_id: string } }) {
  const body = await req.json().catch(() => ({}));
  const sb = supabaseServer();

  const item = {
    po_id: params.po_id,
    item_no: body.item_no,
    mm_material: body.mm_material,
    qty: Number(body.qty ?? 1),
    unit_price_cents: body.unit_price_brl != null ? toCents(String(body.unit_price_brl)) : 0,
    status: body.status ?? "open",
  };

  const { data, error } = await sb.from("mm_purchase_order_item").insert(item).select("*").single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, item: data }, { status: 201 });
}
