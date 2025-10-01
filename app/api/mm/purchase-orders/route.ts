// app/api/mm/purchase-orders/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from '@/lib/supabase/server';

const HeaderSchema = z.object({
  mm_order: z.string().min(1),
  vendor_id: z.string().min(1),
  po_date: z.string().optional(),
  expected_delivery: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional()
});

function toNum(v: unknown) {
  if (typeof v === "string") return Number(v.replace(",", "."));
  return Number(v);
}

export async function POST(req: Request) {
  try {
    const TENANT_ID = "LaplataLunaria";
    const parsed = HeaderSchema.safeParse(await req.json());
    
    if (!parsed.success) {
      return NextResponse.json({ zod: parsed.error.issues }, { status: 400 });
    }
    const p = parsed.data;

    const supabase = supabaseServer();

    // FK: vendor deve existir
    const { data: vendor, error: vendorErr } = await supabase
      .from("mm_vendor")
      .select("vendor_id")
      .eq("tenant_id", TENANT_ID)
      .eq("vendor_id", p.vendor_id)
      .single();

    if (vendorErr || !vendor) {
      return NextResponse.json({ error: "vendor not found" }, { status: 400 });
    }

    // Insere header
    const { data, error } = await supabase.from("mm_purchase_order").insert([{
      tenant_id: TENANT_ID,
      mm_order: p.mm_order,
      vendor_id: p.vendor_id,
      po_date: p.po_date || new Date().toISOString().split('T')[0],
      expected_delivery: p.expected_delivery || null,
      status: p.status || "draft",
      notes: p.notes || ""
    }]).select().single();

    if (error) return NextResponse.json({ supabase: error }, { status: 500 });
    return NextResponse.json({ ok: true, header: data }, { status: 201 });

  } catch (e: any) {
    return NextResponse.json({ exception: String(e?.message ?? e) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const TENANT_ID = "LaplataLunaria";
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from("mm_purchase_order")
      .select("*")
      .eq("tenant_id", TENANT_ID)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ supabase: error }, { status: 500 });
    return NextResponse.json({ data }, { status: 200 });

  } catch (e: any) {
    return NextResponse.json({ exception: String(e?.message ?? e) }, { status: 500 });
  }
}

