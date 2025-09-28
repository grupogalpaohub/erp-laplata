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
    
    // VALIDAÇÃO RIGOROSA: Campos obrigatórios do Header PO
    const requiredFields = ['mm_order', 'vendor_id', 'order_date'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'PO_MISSING_FIELDS', 
          message: `Header PO - Campos obrigatórios ausentes: ${missingFields.join(', ')}` 
        }
      }, { status: 400 });
    }
    
    // VALIDAÇÃO: NUNCA aceitar tenant_id do payload
    if (body.tenant_id) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'PO_TENANT_FORBIDDEN', 
          message: 'tenant_id é derivado da sessão - não pode ser fornecido no payload' 
        }
      }, { status: 400 });
    }
    
    // VALIDAÇÃO: Formato de data
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(body.order_date)) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'PO_INVALID_DATE', 
          message: 'order_date deve estar no formato yyyy-mm-dd' 
        }
      }, { status: 400 });
    }
    
    const po: MM_PurchaseOrder = {
      tenant_id,
      mm_order: body.mm_order,                    // Campo correto
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

export async function DELETE(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const tenant_id = await getTenantFromSession();
    const supabase = supabaseServer();
    
    const url = new URL(req.url);
    const mm_order = url.pathname.split('/').pop();
    
    if (!mm_order) {
      return NextResponse.json({
        ok: false,
        error: { code: 'PO_MISSING_ORDER_ID', message: 'mm_order é obrigatório' }
      }, { status: 400 });
    }
    
    // Verificar se existem itens antes de deletar
    const { data: items, error: itemsError } = await supabase
      .from('mm_purchase_order_item')
      .select('po_item_id')
      .eq('tenant_id', tenant_id)
      .eq('mm_order', mm_order)
      .limit(1);
    
    if (itemsError) {
      return NextResponse.json({
        ok: false,
        error: { code: 'PO_ITEMS_CHECK_FAILED', message: itemsError.message }
      }, { status: 400 });
    }
    
    if (items && items.length > 0) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'PO_HAS_ITEMS', 
          message: 'Não é possível deletar PO com itens. Delete os itens primeiro ou use cascade.' 
        }
      }, { status: 400 });
    }
    
    // Deletar PO
    const { error } = await supabase
      .from('mm_purchase_order')
      .delete()
      .eq('tenant_id', tenant_id)
      .eq('mm_order', mm_order);
    
    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'PO_DELETE_FAILED', message: error.message }
      }, { status: 400 });
    }
    
    return NextResponse.json({
      ok: true,
      data: { deleted: true, mm_order }
    });
    
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: { code: 'PO_DELETE_ERROR', message: error.message }
    }, { status: 500 });
  }
}
