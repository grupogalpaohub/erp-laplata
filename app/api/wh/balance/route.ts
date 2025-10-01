// app/api/wh/balance/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const TENANT_ID = "LaplataLunaria";
  const { searchParams } = new URL(req.url);
  const plant_id = searchParams.get("plant_id") ?? undefined;
  const material = searchParams.get("material") ?? undefined;

  const supabase = supabaseServer();

  let q = supabase.from("wh_inventory_balance")
    .select("plant_id, mm_material, on_hand_qty, reserved_qty, last_count_date, status, quantity_available")
    .eq("tenant_id", TENANT_ID);

  if (plant_id) q = q.eq("plant_id", plant_id);
  if (material) q = q.eq("mm_material", material);

  const { data, error } = await q.order("plant_id").order("mm_material");
  if (error) return NextResponse.json({ supabase: error }, { status: 500 });

  return NextResponse.json({ data }, { status: 200 });
}