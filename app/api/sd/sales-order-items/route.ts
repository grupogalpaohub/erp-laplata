// app/api/sd/sales-order-items/route.ts
// API para Sales Order Items usando campos CORRETOS do schema real
// GUARDRAIL COMPLIANCE: @supabase/ssr + cookies()

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/utils/supabase/server';
import { getTenantFromSession } from '@/utils/supabase/tenant';
import { SD_SalesOrderItem, ApiResponse, PaginatedResponse } from '@/src/types/db';

export async function GET(req: Request): Promise<NextResponse<PaginatedResponse<SD_SalesOrderItem>>> {
  try {
    const tenant_id = await getTenantFromSession();
    const supabase = supabaseServer();
    
    const url = new URL(req.url);
    const so_id = url.searchParams.get("so_id")?.trim();
    const page = Number(url.searchParams.get("page") ?? 1);
    const pageSize = Math.min(Number(url.searchParams.get("pageSize") ?? 50), 200);
    
    let query = supabase
      .from('sd_sales_order_item')
      .select('*', { count: 'exact' })
      .eq('tenant_id', tenant_id);
    
    if (so_id) {
      query = query.eq('so_id', so_id);
    }
    
    query = query.order('row_no', { ascending: true });
    
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, count, error } = await query.range(from, to);
    
    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'SOI_FETCH_FAILED', message: error.message }
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
      error: { code: 'SOI_FETCH_ERROR', message: error.message }
    }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse<SD_SalesOrderItem>>> {
  try {
    const tenant_id = await getTenantFromSession();
    const supabase = supabaseServer();
    const body = await req.json();
    
    // VALIDAÇÃO RIGOROSA: Campos obrigatórios do Sales Order Item
    const requiredFields = ['so_id', 'mm_material', 'quantity', 'unit_price_cents', 'line_total_cents', 'row_no'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'SOI_MISSING_FIELDS', 
          message: `Sales Order Item - Campos obrigatórios ausentes: ${missingFields.join(', ')}` 
        }
      }, { status: 400 });
    }
    
    // VALIDAÇÃO: NUNCA aceitar tenant_id do payload
    if (body.tenant_id) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'SOI_TENANT_FORBIDDEN', 
          message: 'tenant_id é derivado da sessão - não pode ser fornecido no payload' 
        }
      }, { status: 400 });
    }
    
    // VALIDAÇÃO FK: Verificar se so_id existe
    const { data: soExists, error: soError } = await supabase
      .from('sd_sales_order')
      .select('so_id')
      .eq('tenant_id', tenant_id)
      .eq('so_id', body.so_id)
      .single();
    
    if (soError || !soExists) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'FK_SO_NOT_FOUND', 
          message: `Sales Order '${body.so_id}' não encontrada` 
        }
      }, { status: 400 });
    }
    
    // VALIDAÇÃO FK: Verificar se mm_material existe
    const { data: materialExists, error: materialError } = await supabase
      .from('mm_material')
      .select('mm_material')
      .eq('tenant_id', tenant_id)
      .eq('mm_material', body.mm_material)
      .single();
    
    if (materialError || !materialExists) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'FK_MM_MATERIAL_NOT_FOUND', 
          message: `Material '${body.mm_material}' não encontrado` 
        }
      }, { status: 400 });
    }
    
    // Validar que quantity é string (numeric)
    if (typeof body.quantity !== 'string') {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'SOI_INVALID_QUANTITY', 
          message: 'quantity deve ser uma string (numeric)' 
        }
      }, { status: 400 });
    }
    
    // Validar que unit_price_cents é número
    if (typeof body.unit_price_cents !== 'number') {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'SOI_INVALID_PRICE', 
          message: 'unit_price_cents deve ser um número' 
        }
      }, { status: 400 });
    }
    
    // Validar que line_total_cents é número
    if (typeof body.line_total_cents !== 'number') {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'SOI_INVALID_TOTAL', 
          message: 'line_total_cents deve ser um número' 
        }
      }, { status: 400 });
    }
    
    // Validar que row_no é número
    if (typeof body.row_no !== 'number') {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'SOI_INVALID_ROW', 
          message: 'row_no deve ser um número' 
        }
      }, { status: 400 });
    }
    
    const soi: SD_SalesOrderItem = {
      tenant_id,
      so_id: body.so_id,
      mm_material: body.mm_material,              // Campo correto
      quantity: body.quantity,                    // string (numeric)
      unit_price_cents: body.unit_price_cents,
      line_total_cents: body.line_total_cents,
      row_no: body.row_no,
      unit_price_cents_at_order: body.unit_price_cents_at_order ?? null,
    };
    
    const { data, error } = await supabase
      .from('sd_sales_order_item')
      .insert(soi)
      .select('*')
      .single();
    
    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'SOI_CREATE_FAILED', message: error.message }
      }, { status: 400 });
    }
    
    return NextResponse.json({
      ok: true,
      data
    }, { status: 201 });
    
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: { code: 'SOI_CREATE_ERROR', message: error.message }
    }, { status: 500 });
  }
}

export async function PUT(req: Request): Promise<NextResponse<ApiResponse<SD_SalesOrderItem>>> {
  try {
    const tenant_id = await getTenantFromSession();
    const supabase = supabaseServer();
    const body = await req.json();
    
    // Validar campos obrigatórios para update
    const requiredFields = ['so_id', 'mm_material'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'SOI_MISSING_FIELDS', 
          message: `Campos obrigatórios ausentes: ${missingFields.join(', ')}` 
        }
      }, { status: 400 });
    }
    
    // VALIDAÇÃO: NUNCA aceitar tenant_id do payload
    if (body.tenant_id) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'SOI_TENANT_FORBIDDEN', 
          message: 'tenant_id é derivado da sessão - não pode ser fornecido no payload' 
        }
      }, { status: 400 });
    }
    
    const updateData: Partial<Omit<SD_SalesOrderItem, 'tenant_id' | 'so_id' | 'mm_material'>> = {
      quantity: body.quantity ?? undefined,
      unit_price_cents: body.unit_price_cents ?? undefined,
      line_total_cents: body.line_total_cents ?? undefined,
      row_no: body.row_no ?? undefined,
      unit_price_cents_at_order: body.unit_price_cents_at_order ?? undefined,
    };
    
    // Remover campos undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });
    
    const { data, error } = await supabase
      .from('sd_sales_order_item')
      .update(updateData)
      .eq('tenant_id', tenant_id)
      .eq('so_id', body.so_id)
      .eq('mm_material', body.mm_material)
      .select('*')
      .single();
    
    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'SOI_UPDATE_FAILED', message: error.message }
      }, { status: 400 });
    }
    
    return NextResponse.json({
      ok: true,
      data
    });
    
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: { code: 'SOI_UPDATE_ERROR', message: error.message }
    }, { status: 500 });
  }
}

export async function DELETE(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const tenant_id = await getTenantFromSession();
    const supabase = supabaseServer();
    
    const url = new URL(req.url);
    const so_id = url.searchParams.get("so_id");
    const mm_material = url.searchParams.get("mm_material");
    
    if (!so_id || !mm_material) {
      return NextResponse.json({
        ok: false,
        error: { code: 'SOI_MISSING_PARAMS', message: 'so_id e mm_material são obrigatórios' }
      }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('sd_sales_order_item')
      .delete()
      .eq('tenant_id', tenant_id)
      .eq('so_id', so_id)
      .eq('mm_material', mm_material);
    
    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'SOI_DELETE_FAILED', message: error.message }
      }, { status: 400 });
    }
    
    return NextResponse.json({
      ok: true,
      data: { deleted: true, so_id, mm_material }
    });
    
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: { code: 'SOI_DELETE_ERROR', message: error.message }
    }, { status: 500 });
  }
}
