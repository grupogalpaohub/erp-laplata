import { supabaseServer } from '@/lib/supabase/server'
// app/api/wh/warehouses/[plant_id]/route.ts
import { NextResponse } from "next/server";



export async function GET(_: Request, { params }: { params: { plant_id: string } }) {
  // ✅ GUARDRAIL COMPLIANCE: API usando @supabase/ssr e cookies()
  const sb = supabaseServer()
  const { data, error } = await sb.from("wh_warehouse").select("*").eq("plant_id", params.plant_id).single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 404 });
  return NextResponse.json({ ok:true, warehouse: data });
}

export async function PATCH(req: Request, { params }: { params: { plant_id: string } }) {
  const patch = await req.json().catch(() => ({}));
  // ✅ GUARDRAIL COMPLIANCE: API usando @supabase/ssr e cookies()
  const sb = supabaseServer()

  // Mapear campos para nomes corretos do banco
  const dbPatch: any = {}
  if (patch.name !== undefined) dbPatch.name = patch.name
  if (patch.is_default !== undefined) dbPatch.is_default = patch.is_default
  if (patch.address !== undefined) dbPatch.address = patch.address
  if (patch.city !== undefined) dbPatch.city = patch.city
  if (patch.state !== undefined) dbPatch.state = patch.state
  if (patch.zip_code !== undefined) dbPatch.zip_code = patch.zip_code
  if (patch.country !== undefined) dbPatch.country = patch.country
  if (patch.contact_person !== undefined) dbPatch.contact_person = patch.contact_person
  if (patch.phone !== undefined) dbPatch.phone = patch.phone
  if (patch.email !== undefined) dbPatch.email = patch.email

  const { data, error } = await sb.from("wh_warehouse").update(dbPatch).eq("plant_id", params.plant_id).select("*").single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, warehouse: data });
}

export async function DELETE(_: Request, { params }: { params: { plant_id: string } }) {
  // ✅ GUARDRAIL COMPLIANCE: API usando @supabase/ssr e cookies()
  const sb = supabaseServer()
  const { error } = await sb.from("wh_warehouse").delete().eq("plant_id", params.plant_id);
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true });
}
