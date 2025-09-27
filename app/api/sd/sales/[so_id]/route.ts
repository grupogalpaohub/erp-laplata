// app/api/sd/sales/[so_id]/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(_: Request, { params }: { params: { so_id: string } }) {
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
        set() {},
        remove() {}
      }
    }
  )
  const { data, error } = await sb.from("sd_sales_order").select("*").eq("so_id", params.so_id).single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 404 });
  return NextResponse.json({ ok:true, so: data });
}

export async function PATCH(req: Request, { params }: { params: { so_id: string } }) {
  const patch = await req.json().catch(() => ({}));
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
        set() {},
        remove() {}
      }
    }
  )

  // Mapear campos para nomes corretos do banco
  const dbPatch: any = {}
  if (patch.customer_id !== undefined) dbPatch.customer_id = patch.customer_id
  if (patch.order_date !== undefined) dbPatch.order_date = patch.order_date
  if (patch.expected_ship !== undefined) dbPatch.expected_ship = patch.expected_ship
  if (patch.total_cents !== undefined) dbPatch.total_cents = patch.total_cents
  if (patch.doc_no !== undefined) dbPatch.doc_no = patch.doc_no
  if (patch.payment_method !== undefined) dbPatch.payment_method = patch.payment_method
  if (patch.payment_term !== undefined) dbPatch.payment_term = patch.payment_term
  if (patch.notes !== undefined) dbPatch.notes = patch.notes
  if (patch.status !== undefined) dbPatch.status = patch.status

  const { data, error } = await sb.from("sd_sales_order").update(dbPatch).eq("so_id", params.so_id).select("*").single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, so: data });
}

export async function DELETE(_: Request, { params }: { params: { so_id: string } }) {
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
        set() {},
        remove() {}
      }
    }
  )
  const { error } = await sb.from("sd_sales_order").delete().eq("so_id", params.so_id);
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true });
}
