import { supabaseServer } from '@/lib/supabase/server'
// app/api/mm/materials/[mm_material]/route.ts
import { NextResponse } from "next/server";


import { toCents } from "@/lib/money";

export async function GET(_: Request, { params }: { params: { mm_material: string } }) {
  // ✅ GUARDRAIL COMPLIANCE: API usando @supabase/ssr e cookies()
  const sb = supabaseServer()
  const { data, error } = await sb.from("mm_material").select("*").eq("mm_material", params.mm_material).single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 404 });
  return NextResponse.json({ ok:true, material: data });
}

export async function PATCH(req: Request, { params }: { params: { mm_material: string } }) {
  const body = await req.json().catch(() => ({}));
  // ✅ GUARDRAIL COMPLIANCE: API usando @supabase/ssr e cookies()
  const sb = supabaseServer()

              const patch: any = {
                // mm_comercial: false, // não persistir - mapeado no código
                mm_desc: body.mm_desc,
                mm_mat_type: body.mm_mat_type ?? null,
                mm_mat_class: body.mm_mat_class ?? null,
                status: body.status ?? undefined,
                mm_vendor_id: body.mm_vendor_id ?? null,
                commercial_name: body.commercial_name ?? null,
                unit_of_measure: body.unit_of_measure ?? null,
                dimensions: body.dimensions ?? null,
                purity: body.purity ?? null,
                color: body.color ?? null,
                finish: body.finish ?? null,
                min_stock: body.min_stock ?? null,
                max_stock: body.max_stock ?? null,
                lead_time_days: body.lead_time_days ?? null
              };
              if (body.unit_price_brl != null) patch.mm_price_cents = toCents(String(body.unit_price_brl));
              if (body.purchase_price_brl != null) patch.mm_purchase_price_cents = toCents(String(body.purchase_price_brl));

  const { data, error } = await sb.from("mm_material").update(patch).eq("mm_material", params.mm_material).select("*").single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, material: data });
}

export async function DELETE(_: Request, { params }: { params: { mm_material: string } }) {
  // ✅ GUARDRAIL COMPLIANCE: API usando @supabase/ssr e cookies()
  const sb = supabaseServer()
  const { error } = await sb.from("mm_material").delete().eq("mm_material", params.mm_material);
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true });
}
