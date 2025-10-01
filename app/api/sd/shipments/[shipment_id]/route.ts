// app/api/sd/shipments/[shipment_id]/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from '@/utils/supabase/server';

type Params = { shipment_id: string };

export async function DELETE(_req: Request, { params }: { params: Params }) {
  try {
    const TENANT_ID = "LaplataLunaria";
    const shipment_id = params.shipment_id;

    const supabase = supabaseServer();

    const { error } = await supabase
      .from("sd_shipment")
      .delete()
      .eq("tenant_id", TENANT_ID)
      .eq("shipment_id", shipment_id);

    if (error) return NextResponse.json({ supabase: error }, { status: 500 });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ exception: String(e?.message ?? e) }, { status: 500 });
  }
}
