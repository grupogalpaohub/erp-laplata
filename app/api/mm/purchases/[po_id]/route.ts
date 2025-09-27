// app/api/mm/purchases/[po_id]/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(_: Request, { params }: { params: { po_id: string } }) {
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
  const { data, error } = await sb.from("mm_purchase_order").select("*").eq("mm_order", params.po_id).single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 404 });
  return NextResponse.json({ ok:true, po: data });
}

export async function PATCH(req: Request, { params }: { params: { po_id: string } }) {
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
  if (patch.vendor_id !== undefined) dbPatch.vendor_id = patch.vendor_id
  if (patch.po_date !== undefined) {
    dbPatch.po_date = patch.po_date
    dbPatch.order_date = patch.po_date // manter ambos
  }
  if (patch.expected_delivery !== undefined) dbPatch.expected_delivery = patch.expected_delivery
  if (patch.notes !== undefined) dbPatch.notes = patch.notes
  if (patch.total_cents !== undefined) dbPatch.total_cents = patch.total_cents
  if (patch.status !== undefined) dbPatch.status = patch.status

  const { data, error } = await sb.from("mm_purchase_order").update(dbPatch).eq("mm_order", params.po_id).select("*").single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, po: data });
}
