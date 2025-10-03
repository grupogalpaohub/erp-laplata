// app/api/wh/balance/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const supabase = supabaseServer();
    
    // GUARDRAIL: Verificar autenticação via supabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({
        ok: false,
        error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado' }
      }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const plant_id = searchParams.get("plant_id") ?? undefined;
    const material = searchParams.get("material") ?? undefined;

    // RLS filtra automaticamente por tenant_id
    let q = supabase.from("wh_inventory_balance")
      .select("plant_id, mm_material, on_hand_qty, reserved_qty, last_count_date, status");

    if (plant_id) q = q.eq("plant_id", plant_id);
    if (material) q = q.eq("mm_material", material);

    const { data, error } = await q.order("plant_id").order("mm_material");
    
    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'DB_ERROR', message: error.message }
      }, { status: 500 });
    }

    // Calcular quantity_available em memória
    const rows = (data ?? []).map((r: any) => ({
      ...r,
      quantity_available: Number(r.on_hand_qty ?? 0) - Number(r.reserved_qty ?? 0),
    }));

    return NextResponse.json({ 
      ok: true, 
      data: rows 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' }
    }, { status: 500 });
  }
}
