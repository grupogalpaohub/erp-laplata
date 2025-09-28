import { supabaseServer } from '@/utils/supabase/server'
// app/api/crm/customers/route.ts
import { NextResponse } from "next/server";



export async function GET(req: Request) {
  // ✅ GUARDRAIL COMPLIANCE: API usando @supabase/ssr e cookies()
  const sb = supabaseServer()
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const page = Number(url.searchParams.get("page") ?? 1);
  const pageSize = Math.min(Number(url.searchParams.get("pageSize") ?? 50), 200);

  let query = sb.from("crm_customer").select("*", { count: "exact" }).order("created_date", { ascending: false });
  if (q) query = query.ilike("name", `%${q}%`).or(`contact_email.ilike.%${q}%,customer_id.ilike.%${q}%`);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await query.range(from, to);
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });

  return NextResponse.json({ ok:true, items: data, total: count ?? 0, page, pageSize });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  // ✅ GUARDRAIL COMPLIANCE: API usando @supabase/ssr e cookies()
  const sb = supabaseServer()

  const customer = {
    customer_id: body.customer_id,
    name: body.name,
    email: body.email ?? null,
    contact_email: body.contact_email ?? body.email ?? null,
    telefone: body.telefone ?? null,
    contact_phone: body.contact_phone ?? body.telefone ?? null,
    customer_type: body.customer_type ?? "PF",
    status: body.status ?? "active",
    customer_category: body.customer_category ?? null,
    lead_classification: body.lead_classification ?? null,
    sales_channel: body.sales_channel ?? null,
    notes: body.notes ?? null,
    preferred_payment_method: body.preferred_payment_method ?? null,
    preferred_payment_terms: body.preferred_payment_terms ?? null,
    contact_name: body.contact_name ?? null,
    document_id: body.document_id ?? null,
    addr_street: body.addr_street ?? null,
    addr_number: body.addr_number ?? null,
    addr_complement: body.addr_complement ?? null,
    addr_district: body.addr_district ?? null,
    addr_city: body.addr_city ?? null,
    addr_state: body.addr_state ?? null,
    addr_zip: body.addr_zip ?? null,
    addr_country: body.addr_country ?? "BR",
    phone_country: body.phone_country ?? "BR",
    is_active: body.is_active ?? true
  };

  const { data, error } = await sb.from("crm_customer").insert(customer).select("*").single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, customer: data }, { status: 201 });
}
