import { supabaseServer } from '@/lib/supabase/server'
// app/api/sd/sales/[so_id]/items/route.ts
import { NextResponse } from "next/server";

// Forçar Node.js runtime para APIs que usam Supabase
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { toCents } from "@/lib/money";

export async function GET(_: Request, { params }: { params: { so_id: string } }) {
  // ✅ GUARDRAIL COMPLIANCE: API usando @supabase/ssr e cookies()
  const sb = supabaseServer()
  const { data, error } = await sb.from("sd_sales_order_item").select("*").eq("so_id", params.so_id).order("row_no");
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, items: data });
}

export async function POST(req: Request, { params }: { params: { so_id: string } }) {
  const body = await req.json().catch(() => ({}));
  // ✅ GUARDRAIL COMPLIANCE: API usando @supabase/ssr e cookies()
  const sb = supabaseServer()

  const item = {
    so_id: params.so_id,
    sku: body.sku,
    mm_material: body.mm_material ?? body.sku, // CORRETO - usar mm_material
    quantity: Number(body.quantity ?? 1),
    unit_price_cents: body.unit_price_brl != null ? toCents(String(body.unit_price_brl)) : 0,
    line_total_cents: Number(body.quantity ?? 1) * (body.unit_price_brl != null ? toCents(String(body.unit_price_brl)) : 0),
    row_no: body.row_no ?? 1,
    unit_price_cents_at_order: body.unit_price_brl != null ? toCents(String(body.unit_price_brl)) : null
  };

  const { data, error } = await sb.from("sd_sales_order_item").insert(item).select("*").single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, item: data }, { status: 201 });
}
