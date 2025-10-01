import { NextResponse } from "next/server";
import { supabaseServer } from '@/utils/supabase/server';

export async function GET(req: Request) {
  try {
    const TENANT_ID = "LaplataLunaria"; // dev: nunca do client
    const { searchParams } = new URL(req.url);
    const plant_id = searchParams.get('plant_id');
    const mm_material = searchParams.get('mm_material');

    // client server-only com service role
    const supabase = supabaseServer();

    let query = supabase
      .from("wh_inventory_balance")
      .select("plant_id, mm_material, on_hand_qty, updated_at")
      .eq("tenant_id", TENANT_ID)
      .order("plant_id")
      .order("mm_material");

    // Filtros opcionais
    if (plant_id) {
      query = query.eq("plant_id", plant_id);
    }
    if (mm_material) {
      query = query.eq("mm_material", mm_material);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ supabase: error }, { status: 500 });
    }
    
    return NextResponse.json({ 
      ok: true, 
      data: data || [],
      count: data?.length || 0
    }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ exception: String(e?.message ?? e) }, { status: 500 });
  }
}

