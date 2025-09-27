// app/api/mm/vendors/[vendor_id]/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: { vendor_id: string } }) {
  const sb = supabaseServer();
  const { data, error } = await sb.from("mm_vendor").select("*").eq("vendor_id", params.vendor_id).single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 404 });
  return NextResponse.json({ ok:true, vendor: data });
}

export async function PATCH(req: Request, { params }: { params: { vendor_id: string } }) {
  const patch = await req.json().catch(() => ({}));
  const sb = supabaseServer();

  // Mapear campos para nomes corretos do banco
  const dbPatch: any = {}
  if (patch.vendor_name !== undefined) dbPatch.vendor_name = patch.vendor_name
  if (patch.email !== undefined) dbPatch.email = patch.email
  if (patch.telefone !== undefined) dbPatch.telefone = patch.telefone
  if (patch.cidade !== undefined) dbPatch.cidade = patch.cidade
  if (patch.estado !== undefined) dbPatch.estado = patch.estado
  if (patch.vendor_rating !== undefined) dbPatch.vendor_rating = patch.vendor_rating
  if (patch.contact_person !== undefined) dbPatch.contact_person = patch.contact_person
  if (patch.address !== undefined) dbPatch.address = patch.address
  if (patch.city !== undefined) dbPatch.city = patch.city
  if (patch.state !== undefined) dbPatch.state = patch.state
  if (patch.zip_code !== undefined) dbPatch.zip_code = patch.zip_code
  if (patch.country !== undefined) dbPatch.country = patch.country
  if (patch.tax_id !== undefined) dbPatch.tax_id = patch.tax_id
  if (patch.payment_terms !== undefined) dbPatch.payment_terms = patch.payment_terms
  if (patch.rating !== undefined) dbPatch.rating = patch.rating
  if (patch.status !== undefined) dbPatch.status = patch.status

  const { data, error } = await sb.from("mm_vendor").update(dbPatch).eq("vendor_id", params.vendor_id).select("*").single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, vendor: data });
}

export async function DELETE(_: Request, { params }: { params: { vendor_id: string } }) {
  const sb = supabaseServer();
  const { error } = await sb.from("mm_vendor").delete().eq("vendor_id", params.vendor_id);
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true });
}
