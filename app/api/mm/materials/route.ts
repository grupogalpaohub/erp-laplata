import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
  const { data, error } = await sb.from("mm_material").select("*").limit(50);
  return Response.json({ ok: !error, items: data ?? [], error });
}

export async function POST(req: Request) {
  const cookieStore = cookies()
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
  const body = await req.json().catch(() => ({}));
  
  const material = {
    mm_material: body.mm_material,
    mm_comercial: body.mm_comercial ?? null,
    mm_desc: body.mm_desc,
    mm_mat_type: body.mm_mat_type ?? null,
    mm_mat_class: body.mm_mat_class ?? null,
    mm_price_cents: body.mm_price_cents ?? 0,
    barcode: body.barcode ?? null,
    weight_grams: body.weight_grams ?? null,
    status: body.status ?? "active",
    mm_pur_link: body.mm_pur_link ?? null,
    mm_vendor_id: body.mm_vendor_id ?? null,
    commercial_name: body.commercial_name ?? null,
    unit_of_measure: body.unit_of_measure ?? "unidade",
    dimensions: body.dimensions ?? null,
    purity: body.purity ?? null,
    color: body.color ?? null,
    finish: body.finish ?? null,
    min_stock: body.min_stock ?? 0,
    max_stock: body.max_stock ?? 1000,
    lead_time_days: body.lead_time_days ?? 7,
    price_last_updated_at: new Date().toISOString(),
    mm_purchase_price_cents: body.mm_purchase_price_cents ?? null
  };

  const { data, error } = await sb.from("mm_material").insert(material).select("*").single();
  if (error) return Response.json({ ok: false, error: error.message }, { status: 400 });
  return Response.json({ ok: true, material: data }, { status: 201 });
}