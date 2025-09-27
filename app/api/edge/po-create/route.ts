import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// IMPORTANTE: runtime Node (não edge) para acesso a env segura
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const svc = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only

    const admin = createClient(url, svc, { auth: { persistSession: false } });

    const { vendor_id, items, notes } = await req.json();

    // Get tenant_id from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await admin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid token');
    }

    const tenantId = user.user_metadata?.tenant_id;
    if (!tenantId) {
      throw new Error('tenant_id not found in user metadata');
    }

    // Generate PO number
    const { data: poNumber, error: poError } = await admin
      .rpc('next_doc_number', { p_tenant: tenantId, p_doc_type: 'MM' });

    if (poError) throw poError;

    // Create purchase order
    const poData = {
      po_id: poNumber,
      tenant_id: tenantId,
      vendor_id,
      order_date: new Date().toISOString().split('T')[0],
      expected_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      status: 'draft',
      total_amount: 0,
      currency: 'BRL',
      notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: po, error: poInsertError } = await admin
      .from('mm_purchase_order')
      .insert(poData)
      .select()
      .single();

    if (poInsertError) throw poInsertError;

    // Create purchase order items
    const poItems = items.map((item: any, index: number) => ({
      item_id: `POI${String(index + 1).padStart(3, '0')}`,
      tenant_id: tenantId,
      po_id: poNumber,
      sku: item.sku,
      quantity: item.quantity,
      unit_price: item.unit_price,
      currency: 'BRL',
      notes: item.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { data: itemsData, error: itemsError } = await admin
      .from('mm_purchase_order_item')
      .insert(poItems)
      .select();

    if (itemsError) throw itemsError;

    // Get updated PO with total
    const { data: updatedPO, error: fetchError } = await admin
      .from('mm_purchase_order')
      .select('*')
      .eq('po_id', poNumber)
      .eq('tenant_id', tenantId)
      .single();

    if (fetchError) throw fetchError;

    return NextResponse.json({
      success: true,
      data: {
        po: updatedPO,
        items: itemsData
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('PO create error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
