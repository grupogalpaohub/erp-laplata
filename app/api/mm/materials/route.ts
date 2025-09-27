// app/api/mm/materials/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { toCents } from "@/lib/money";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const page = Number(url.searchParams.get("page") ?? 1);
  const pageSize = Math.min(Number(url.searchParams.get("pageSize") ?? 50), 200);

  const sb = supabaseServer();
  let query = sb.from("mm_material").select("*", { count: "exact" }).order("mm_material");
  if (q) query = query.ilike("mm_desc", `%${q}%`);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await query.range(from, to);
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });

  return NextResponse.json({ ok:true, items: data, total: count ?? 0, page, pageSize });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const sb = supabaseServer();

              const payload: any = {
                mm_material: body.mm_material,
                mm_comercial: body.mm_comercial ?? null,
                mm_desc: body.mm_desc,
                mm_mat_type: body.mm_mat_type ?? null,
                mm_mat_class: body.mm_mat_class ?? null,
                status: body.status ?? "active",
                mm_vendor_id: body.mm_vendor_id ?? null,
                mm_price_cents: body.unit_price_brl != null ? toCents(String(body.unit_price_brl)) : 0,
                mm_purchase_price_cents: body.purchase_price_brl != null ? toCents(String(body.purchase_price_brl)) : 0,
                commercial_name: body.commercial_name ?? null,
                unit_of_measure: body.unit_of_measure ?? 'unidade',
                dimensions: body.dimensions ?? null,
                purity: body.purity ?? null,
                color: body.color ?? null,
                finish: body.finish ?? null,
                min_stock: body.min_stock ?? 0,
                max_stock: body.max_stock ?? 1000,
                lead_time_days: body.lead_time_days ?? 7
              };

  const { data, error } = await sb.from("mm_material").insert(payload).select("*").single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, material: data }, { status: 201 });
}
