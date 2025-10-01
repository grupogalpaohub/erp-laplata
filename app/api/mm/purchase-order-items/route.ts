import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from '@/lib/supabase/server';

const ItemSchema = z.object({
  mm_order: z.string().min(1),
  mm_material: z.string().min(1),
  plant_id: z.string().min(1),
  mm_qtt: z.union([z.number(), z.string()]),
  unit_cost_cents: z.union([z.number(), z.string()]).optional(),
  unit_price_brl: z.union([z.number(), z.string()]).optional(),
  notes: z.string().optional(),
});

function toNumber(input: unknown, def = 0) {
  if (typeof input === "string") {
    const n = Number(input.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", "."));
    return Number.isFinite(n) ? n : def;
  }
  const n = Number(input);
  return Number.isFinite(n) ? n : def;
}
function brlToCents(v: unknown) {
  const n = toNumber(v, 0);
  return Math.round(n * 100);
}

export async function POST(req: Request) {
  try {
    const TENANT_ID = "LaplataLunaria";
    const body = await req.json();
    const parsed = ItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ zod: parsed.error.issues }, { status: 400 });
    }
    const p = parsed.data;

    const supabase = supabaseServer();

    // FK: header deve existir
    const { data: po, error: poErr } = await supabase
      .from("mm_purchase_order")
      .select("mm_order")
      .eq("tenant_id", TENANT_ID)
      .eq("mm_order", p.mm_order)
      .single();

    if (poErr || !po) {
      return NextResponse.json({ error: "Header mm_purchase_order não encontrado." }, { status: 400 });
    }

    const qty = toNumber(p.mm_qtt, 0);
    const cents = p.unit_cost_cents !== undefined
      ? Math.trunc(toNumber(p.unit_cost_cents, 0))
      : brlToCents(p.unit_price_brl);

    const payload = {
      tenant_id: TENANT_ID,
      mm_order: p.mm_order,
      mm_material: p.mm_material,
      plant_id: p.plant_id,
      mm_qtt: qty,
      unit_cost_cents: cents,
      // line_total_cents será calculado no BEFORE trigger
      notes: p.notes ?? "",
    };

    const { error } = await supabase
      .from("mm_purchase_order_item")
      .insert([payload]);

    if (error) {
      return NextResponse.json({ supabase: error }, { status: 500 });
    }

    // devolver header com total para já atualizar a UI
    const { data: header } = await supabase
      .from("mm_purchase_order")
      .select("total_cents")
      .eq("tenant_id", TENANT_ID)
      .eq("mm_order", p.mm_order)
      .single();

    return NextResponse.json({ ok: true, total_cents: header?.total_cents ?? null }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ exception: String(e?.message ?? e) }, { status: 500 });
  }
}