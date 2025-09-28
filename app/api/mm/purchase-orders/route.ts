// app/api/mm/purchase-orders/route.ts
// API para Purchase Orders usando campos CORRETOS do schema real
// GUARDRAIL COMPLIANCE: @supabase/ssr + cookies()

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/utils/supabase/server';
import { getTenantFromSession } from '@/utils/supabase/tenant';
import { MM_PurchaseOrder, ApiResponse, PaginatedResponse } from '@/src/types/db';

export async function GET(req: Request): Promise<NextResponse<PaginatedResponse<MM_PurchaseOrder>>> {
  try {
    const tenant_id = await getTenantFromSession();
    const supabase = supabaseServer();
    
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim() ?? "";
    const page = Number(url.searchParams.get("page") ?? 1);
    const pageSize = Math.min(Number(url.searchParams.get("pageSize") ?? 50), 200);
    
    let query = supabase
      .from('mm_purchase_order')
      .select('*', { count: 'exact' })
      .eq('tenant_id', tenant_id)
      .order('order_date', { ascending: false });
    
    if (q) {
      query = query.or(`mm_order.ilike.%${q}%,vendor_id.ilike.%${q}%`);
    }
    
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, count, error } = await query.range(from, to);
    
    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'PO_FETCH_FAILED', message: error.message }
      }, { status: 400 });
    }
    
    return NextResponse.json({
      ok: true,
      data: data || [],
      total: count ?? 0,
      page,
      pageSize
    });
    
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: { code: 'PO_FETCH_ERROR', message: error.message }
    }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse<MM_PurchaseOrder>>> {
  try {
    const tenant_id = await getTenantFromSession();
    const supabase = supabaseServer();
    const body = await req.json();
    
    // Validar campos obrigatórios
    const requiredFields = ['mm_order', 'vendor_id', 'order_date'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'PO_MISSING_FIELDS', 
          message: `Campos obrigatórios ausentes: ${missingFields.join(', ')}` 
        }
      }, { status: 400 });
    }
    
    const po: MM_PurchaseOrder = {
      tenant_id,
      mm_order: body.mm_order,                    // CORRETO - não po_id
      vendor_id: body.vendor_id,
      order_date: body.order_date,                // yyyy-mm-dd
      status: body.status ?? null,
      po_date: body.po_date ?? null,
      expected_delivery: body.expected_delivery ?? null,
      notes: body.notes ?? null,
      total_amount: body.total_amount ?? null,
      currency: body.currency ?? null,
      total_cents: body.total_cents ?? null,
    };
    
    const { data, error } = await supabase
      .from('mm_purchase_order')
      .insert(po)
      .select('*')
      .single();
    
    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'PO_CREATE_FAILED', message: error.message }
      }, { status: 400 });
    }
    
    return NextResponse.json({
      ok: true,
      data
    }, { status: 201 });
    
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: { code: 'PO_CREATE_ERROR', message: error.message }
    }, { status: 500 });
  }
}
