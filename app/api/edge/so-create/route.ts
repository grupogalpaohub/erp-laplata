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

    const { customer_id, items, notes, channel = 'site' } = await req.json();

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

    // Generate SO number
    const { data: soNumber, error: soError } = await admin
      .rpc('next_doc_number', { p_tenant: tenantId, p_doc_type: 'SO' });

    if (soError) throw soError;

    // Create sales order
    const soData = {
      so_id: soNumber,
      tenant_id: tenantId,
      customer_id,
      order_date: new Date().toISOString().split('T')[0],
      status: 'draft',
      total_amount: 0,
      currency: 'BRL',
      channel,
      notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: so, error: soInsertError } = await admin
      .from('sd_sales_order')
      .insert(soData)
      .select()
      .single();

    if (soInsertError) throw soInsertError;

    // Create sales order items
    const soItems = items.map((item: any, index: number) => ({
      item_id: `SOI${String(index + 1).padStart(3, '0')}`,
      tenant_id: tenantId,
      so_id: soNumber,
      sku: item.sku,
      quantity: item.quantity,
      unit_price: item.unit_price,
      currency: 'BRL',
      notes: item.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { data: itemsData, error: itemsError } = await admin
      .from('sd_sales_order_item')
      .insert(soItems)
      .select();

    if (itemsError) throw itemsError;

    // Get updated SO with total
    const { data: updatedSO, error: fetchError } = await admin
      .from('sd_sales_order')
      .select('*')
      .eq('so_id', soNumber)
      .eq('tenant_id', tenantId)
      .single();

    if (fetchError) throw fetchError;

    return NextResponse.json({
      success: true,
      data: {
        so: updatedSO,
        items: itemsData
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('SO create error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
