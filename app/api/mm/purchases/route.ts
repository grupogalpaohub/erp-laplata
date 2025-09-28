import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // ✅ GUARDRAIL COMPLIANCE: API usando @supabase/ssr e cookies()
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

  const po = {
    mm_order: body.po_id, // ou gere no DB
    vendor_id: body.vendor_id ?? null,
    status: body.status ?? "draft",
    po_date: body.po_date ?? new Date().toISOString().slice(0,10),
    expected_delivery: body.expected_delivery ?? null,
    notes: body.notes ?? null,
    total_amount: body.total_amount ?? 0,
    currency: body.currency ?? 'BRL',
    order_date: body.order_date ?? new Date().toISOString().slice(0,10),
    total_cents: body.total_cents ?? 0
  };

  const { data, error } = await sb.from("mm_purchase_order").insert(po).select("*").single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, po: data }, { status: 201 });
}
