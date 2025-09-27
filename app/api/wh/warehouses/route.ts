// app/api/wh/warehouses/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const page = Number(url.searchParams.get("page") ?? 1);
  const pageSize = Math.min(Number(url.searchParams.get("pageSize") ?? 50), 200);

  const sb = supabaseServer();
  let query = sb.from("wh_warehouse").select("*", { count: "exact" }).order("name");
  if (q) query = query.ilike("name", `%${q}%`).or(`plant_id.ilike.%${q}%,city.ilike.%${q}%`);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await query.range(from, to);
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });

  return NextResponse.json({ ok:true, items: data, total: count ?? 0, page, pageSize });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const sb = supabaseServer();

  const warehouse = {
    plant_id: body.plant_id,
    name: body.name,
    is_default: body.is_default ?? false,
    address: body.address ?? null,
    city: body.city ?? null,
    state: body.state ?? null,
    zip_code: body.zip_code ?? null,
    country: body.country ?? "Brasil",
    contact_person: body.contact_person ?? null,
    phone: body.phone ?? null,
    email: body.email ?? null
  };

  const { data, error } = await sb.from("wh_warehouse").insert(warehouse).select("*").single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, warehouse: data }, { status: 201 });
}
