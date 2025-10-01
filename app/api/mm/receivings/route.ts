// app/api/mm/receivings/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from '@/utils/supabase/server';
import { z } from "zod";

const Body = z.object({
  mm_order: z.string().min(1),
  plant_id: z.string().min(1),
  mm_material: z.string().min(1),
  qty_received: z.union([z.number(), z.string()]),
  notes: z.string().optional()
});

function toNum(v: unknown) {
  if (typeof v === "string") return Number(v.replace(",", "."));
  return Number(v);
}

export async function POST(req: Request) {
  try {
    const TENANT_ID = "LaplataLunaria";
    const p = Body.parse(await req.json());
    const qty = Math.max(0, Math.trunc(toNum(p.qty_received) || 0));

    const supabase = supabaseServer();

    // 1) valida FK do material (evita 23503 que você viu)
    const { data: mat, error: matErr } = await supabase
      .from("mm_material")
      .select("mm_material")
      .eq("tenant_id", TENANT_ID)
      .eq("mm_material", p.mm_material)
      .single();

    if (matErr || !mat) {
      return NextResponse.json({ error: "material not found" }, { status: 400 });
    }

    // 2) insere recebimento
    const { error } = await supabase.from("mm_receiving").insert([{
      tenant_id: TENANT_ID,
      mm_order: p.mm_order,
      plant_id: p.plant_id,        // use o ID real da planta, p.ex. WH-001
      mm_material: p.mm_material,
      qty_received: qty,
      notes: p.notes ?? ""
    }]);

    if (error) return NextResponse.json({ supabase: error }, { status: 500 });
    return NextResponse.json({ ok: true }, { status: 201 });

  } catch (e: any) {
    return NextResponse.json({ exception: String(e?.message ?? e) }, { status: 500 });
  }
}