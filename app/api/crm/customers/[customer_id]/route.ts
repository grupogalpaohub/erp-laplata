// app/api/crm/customers/[customer_id]/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(_: Request, { params }: { params: { customer_id: string } }) {
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
  const { data, error } = await sb.from("crm_customer").select("*").eq("customer_id", params.customer_id).single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 404 });
  return NextResponse.json({ ok:true, customer: data });
}

export async function PATCH(req: Request, { params }: { params: { customer_id: string } }) {
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
  if (patch.name !== undefined) dbPatch.name = patch.name
  if (patch.email !== undefined) dbPatch.email = patch.email
  if (patch.contact_email !== undefined) dbPatch.contact_email = patch.contact_email
  if (patch.telefone !== undefined) dbPatch.telefone = patch.telefone
  if (patch.contact_phone !== undefined) dbPatch.contact_phone = patch.contact_phone
  if (patch.customer_type !== undefined) dbPatch.customer_type = patch.customer_type
  if (patch.status !== undefined) dbPatch.status = patch.status
  if (patch.customer_category !== undefined) dbPatch.customer_category = patch.customer_category
  if (patch.lead_classification !== undefined) dbPatch.lead_classification = patch.lead_classification
  if (patch.sales_channel !== undefined) dbPatch.sales_channel = patch.sales_channel
  if (patch.notes !== undefined) dbPatch.notes = patch.notes
  if (patch.preferred_payment_method !== undefined) dbPatch.preferred_payment_method = patch.preferred_payment_method
  if (patch.preferred_payment_terms !== undefined) dbPatch.preferred_payment_terms = patch.preferred_payment_terms
  if (patch.contact_name !== undefined) dbPatch.contact_name = patch.contact_name
  if (patch.document_id !== undefined) dbPatch.document_id = patch.document_id
  if (patch.addr_street !== undefined) dbPatch.addr_street = patch.addr_street
  if (patch.addr_number !== undefined) dbPatch.addr_number = patch.addr_number
  if (patch.addr_complement !== undefined) dbPatch.addr_complement = patch.addr_complement
  if (patch.addr_district !== undefined) dbPatch.addr_district = patch.addr_district
  if (patch.addr_city !== undefined) dbPatch.addr_city = patch.addr_city
  if (patch.addr_state !== undefined) dbPatch.addr_state = patch.addr_state
  if (patch.addr_zip !== undefined) dbPatch.addr_zip = patch.addr_zip
  if (patch.addr_country !== undefined) dbPatch.addr_country = patch.addr_country
  if (patch.phone_country !== undefined) dbPatch.phone_country = patch.phone_country
  if (patch.is_active !== undefined) dbPatch.is_active = patch.is_active

  const { data, error } = await sb.from("crm_customer").update(dbPatch).eq("customer_id", params.customer_id).select("*").single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, customer: data });
}

export async function DELETE(_: Request, { params }: { params: { customer_id: string } }) {
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
  const { error } = await sb.from("crm_customer").delete().eq("customer_id", params.customer_id);
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true });
}
