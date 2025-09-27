// app/api/mm/purchases/[po_id]/items/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { toCents } from "@/lib/money";

export async function GET(_: Request, { params }: { params: { po_id: string } }) {
  const sb = supabaseServer();
  const { data, error } = await sb.from("mm_purchase_order_item").select("*").eq("mm_order", params.po_id).order("po_item_id");
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, items: data });
}

export async function POST(req: Request, { params }: { params: { po_id: string } }) {
  const body = await req.json().catch(() => ({}));
  const sb = supabaseServer();

  const item = {
    mm_order: params.po_id,
    plant_id: body.plant_id ?? "001", // Default plant
    mm_material: body.mm_material,
    mm_qtt: Number(body.mm_qtt ?? body.qty ?? 1),
    unit_cost_cents: body.unit_price_brl != null ? toCents(String(body.unit_price_brl)) : 0,
    line_total_cents: Number(body.mm_qtt ?? body.qty ?? 1) * (body.unit_price_brl != null ? toCents(String(body.unit_price_brl)) : 0),
    notes: body.notes ?? null,
  };

  const { data, error } = await sb.from("mm_purchase_order_item").insert(item).select("*").single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, item: data }, { status: 201 });
}
