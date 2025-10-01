// app/api/sd/shipments/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from '@/utils/supabase/server';
import { z } from "zod";

const Body = z.object({
  so_id: z.string().min(1),
  warehouse_id: z.string().min(1),
  notes: z.string().optional()
});

export async function POST(req: Request) {
  try {
    const TENANT_ID = "LaplataLunaria";
    const { so_id, warehouse_id, notes } = Body.parse(await req.json());

    const supabase = supabaseServer();

    // 1) valida se o pedido tem itens
    const { data: items, error: itemsErr } = await supabase
      .from("sd_sales_order_item")
      .select("mm_material, quantity")
      .eq("tenant_id", TENANT_ID)
      .eq("so_id", so_id)
      .limit(1);

    if (itemsErr) return NextResponse.json({ supabase: itemsErr }, { status: 500 });
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "sales order has no items" }, { status: 400 });
    }

    // 2) cria shipment_id no server
    const shipment_id = `SHIP-${Date.now()}`;

    // 3) insere shipment
    const { error } = await supabase.from("sd_shipment").insert([{
      tenant_id: TENANT_ID,
      shipment_id,
      so_id,
      warehouse_id,
      status: "pending",
      notes: notes ?? ""
    }]);

    if (error) return NextResponse.json({ supabase: error }, { status: 500 });

    // 4) opcional: retornar id para navegação
    return NextResponse.json({ ok: true, shipment_id }, { status: 201 });

  } catch (e: any) {
    return NextResponse.json({ exception: String(e?.message ?? e) }, { status: 500 });
  }
}