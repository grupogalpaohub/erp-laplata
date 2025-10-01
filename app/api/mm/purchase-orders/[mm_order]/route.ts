import { NextResponse } from "next/server";
import { supabaseServer } from '@/utils/supabase/server';

type Params = { mm_order: string };

export async function GET(_req: Request, { params }: { params: Params }) {
  const orderId = params?.mm_order ?? "";

  if (!orderId) {
    return NextResponse.json({ error: "missing order id" }, { status: 400 });
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
      return NextResponse.json({ error: "purchase order not found" }, { status: 404 });
    }
    return NextResponse.json({ error: headerError.message, code: (headerError as any).code }, { status: 500 });
  }

  // Itens
  const { data: items, error: itemsError } = await supabase
    .from("mm_purchase_order_item")
    .select("*")
    .eq("tenant_id", TENANT_ID)
    .eq("mm_order", orderId)
    .order("po_item_id", { ascending: true });

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message, code: (itemsError as any).code }, { status: 500 });
  }

  return NextResponse.json({ header, items: items ?? [] }, { status: 200 });
}