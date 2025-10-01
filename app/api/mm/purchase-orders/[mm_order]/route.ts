import { NextResponse } from "next/server";
import { supabaseServer } from '@/lib/supabase/server';

type Params = { mm_order: string };

export async function GET(_req: Request, { params }: { params: Params }) {
  const orderId = params?.mm_order ?? "";

  if (!orderId) {
    return NextResponse.json({ ok: false, error: { code: 'MISSING_ORDER_ID', message: 'missing order id' } }, { status: 400 });
  }

  // Em dev, tenant fixo no servidor (NUNCA do client)
  const TENANT_ID = "LaplataLunaria";

  const supabase = supabaseServer();

  // Header
  const { data: header, error: headerError } = await supabase
    .from("mm_purchase_order")
    .select("*")
    .eq("tenant_id", TENANT_ID)
    .eq("mm_order", orderId)
    .single();

  if (headerError) {
    // PGRST116 = row not found
    if ((headerError as any).code === "PGRST116") {
      return NextResponse.json({ ok: false, error: { code: 'ORDER_NOT_FOUND', message: 'purchase order not found' } }, { status: 404 });
    }
    return NextResponse.json({ ok: false, error: { code: (headerError as any).code, message: headerError.message } }, { status: 500 });
  }

  // Itens
  const { data: items, error: itemsError } = await supabase
    .from("mm_purchase_order_item")
    .select("po_item_id, mm_material, quantity, unit_cost_cents, line_total_cents")
    .eq("tenant_id", TENANT_ID)
    .eq("mm_order", orderId)
    .order("po_item_id", { ascending: true });

  if (itemsError) {
    return NextResponse.json({ ok: false, error: { code: (itemsError as any).code, message: itemsError.message } }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data: { header, items: items ?? [] } }, { status: 200 });
}