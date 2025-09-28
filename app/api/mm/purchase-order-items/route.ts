// app/api/mm/purchase-order-items/route.ts
// API para Purchase Order Items usando campos CORRETOS do schema real
// GUARDRAIL COMPLIANCE: @supabase/ssr + cookies()

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/utils/supabase/server';
import { getTenantFromSession } from '@/utils/supabase/tenant';
import { MM_PurchaseOrderItem, ApiResponse, PaginatedResponse } from '@/src/types/db';

export async function GET(req: Request): Promise<NextResponse<PaginatedResponse<MM_PurchaseOrderItem>>> {
  try {
    const tenant_id = await getTenantFromSession();
    const supabase = supabaseServer();
    
    const url = new URL(req.url);
    const mm_order = url.searchParams.get("mm_order")?.trim();
    const page = Number(url.searchParams.get("page") ?? 1);
    const pageSize = Math.min(Number(url.searchParams.get("pageSize") ?? 50), 200);
    
    let query = supabase
      .from('mm_purchase_order_item')
      .select('*', { count: 'exact' })
      .eq('tenant_id', tenant_id);
    
    if (mm_order) {
      query = query.eq('mm_order', mm_order);
    }
    
    query = query.order('po_item_id', { ascending: true });
    
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, count, error } = await query.range(from, to);
    
    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'POI_FETCH_FAILED', message: error.message }
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
      error: { code: 'POI_FETCH_ERROR', message: error.message }
    }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse<MM_PurchaseOrderItem>>> {
  try {
    const tenant_id = await getTenantFromSession();
    const supabase = supabaseServer();
    const body = await req.json();
    
    // VALIDAÇÃO RIGOROSA: Campos obrigatórios do Item PO
    const requiredFields = ['po_item_id', 'mm_order', 'plant_id', 'mm_material', 'mm_qtt', 'unit_cost_cents', 'line_total_cents'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'POI_MISSING_FIELDS', 
          message: `Item PO - Campos obrigatórios ausentes: ${missingFields.join(', ')}` 
        }
      }, { status: 400 });
    }
    
    // VALIDAÇÃO: NUNCA aceitar tenant_id do payload
    if (body.tenant_id) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'POI_TENANT_FORBIDDEN', 
          message: 'tenant_id é derivado da sessão - não pode ser fornecido no payload' 
        }
      }, { status: 400 });
    }
    
    // VALIDAÇÃO FK: Verificar se mm_order existe
    const { data: poExists, error: poError } = await supabase
      .from('mm_purchase_order')
      .select('mm_order')
      .eq('tenant_id', tenant_id)
      .eq('mm_order', body.mm_order)
      .single();
    
    if (poError || !poExists) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'FK_MM_ORDER_NOT_FOUND', 
          message: `Purchase Order '${body.mm_order}' não encontrada` 
        }
      }, { status: 400 });
    }
    
    // Validar que po_item_id é um número (bigint)
    if (typeof body.po_item_id !== 'number') {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'POI_INVALID_ITEM_ID', 
          message: 'po_item_id deve ser um número (bigint)' 
        }
      }, { status: 400 });
    }
    
    // Validar que mm_qtt é string (numeric)
    if (typeof body.mm_qtt !== 'string') {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'POI_INVALID_QUANTITY', 
          message: 'mm_qtt deve ser uma string (numeric)' 
        }
      }, { status: 400 });
    }
    
    const poi: MM_PurchaseOrderItem = {
      tenant_id,
      po_item_id: body.po_item_id,              // BIGINT -> number
      mm_order: body.mm_order,                  // Campo correto
      plant_id: body.plant_id,                  // OBRIGATÓRIO
      mm_material: body.mm_material,
      mm_qtt: body.mm_qtt,                      // numeric -> string
      unit_cost_cents: body.unit_cost_cents,
      line_total_cents: body.line_total_cents,
      notes: body.notes ?? null,
      currency: body.currency ?? null,
      quantity: body.quantity ?? null,
      material_id: body.material_id ?? null,
      freeze_item_price: body.freeze_item_price ?? null,
    };
    
    const { data, error } = await supabase
      .from('mm_purchase_order_item')
      .insert(poi)
      .select('*')
      .single();
    
    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'POI_CREATE_FAILED', message: error.message }
      }, { status: 400 });
    }
    
    return NextResponse.json({
      ok: true,
      data
    }, { status: 201 });
    
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: { code: 'POI_CREATE_ERROR', message: error.message }
    }, { status: 500 });
  }
}
