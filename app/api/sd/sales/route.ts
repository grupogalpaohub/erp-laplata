// app/api/sd/sales/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const page = Number(url.searchParams.get("page") ?? 1);
  const pageSize = Math.min(Number(url.searchParams.get("pageSize") ?? 50), 200);

  const sb = supabaseServer();
  let query = sb.from("sd_sales_order").select("*", { count: "exact" }).order("order_date", { ascending: false });
  if (q) query = query.ilike("doc_no", `%${q}%`);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await query.range(from, to);
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });

  return NextResponse.json({ ok:true, items: data, total: count ?? 0, page, pageSize });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const sb = supabaseServer();

  const so = {
    so_id: body.so_id, // ou gere no DB
    customer_id: body.customer_id ?? null,
    status: body.status ?? "draft",
    order_date: body.order_date ?? new Date().toISOString().slice(0,10),
    expected_ship: body.expected_ship ?? null,
    total_cents: 0,
    doc_no: body.doc_no ?? null,
    payment_method: body.payment_method ?? null,
    payment_term: body.payment_term ?? null,
    notes: body.notes ?? null
  };

  const { data, error } = await sb.from("sd_sales_order").insert(so).select("*").single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, so: data }, { status: 201 });
}
