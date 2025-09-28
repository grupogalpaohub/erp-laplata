// app/api/wh/balance/route.ts
// API para Inventory Balance usando campos CORRETOS do schema real
// GUARDRAIL COMPLIANCE: @supabase/ssr + cookies()
// IMPORTANTE: NUNCA inserir quantity_available (é generated column)

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/utils/supabase/server';
import { getTenantFromSession } from '@/utils/supabase/tenant';
import { WH_InventoryBalance, ApiResponse, PaginatedResponse } from '@/src/types/db';

export async function GET(req: Request): Promise<NextResponse<PaginatedResponse<WH_InventoryBalance>>> {
  try {
    const tenant_id = await getTenantFromSession();
    const supabase = supabaseServer();
    
    const url = new URL(req.url);
    const plant_id = url.searchParams.get("plant_id")?.trim();
    const mm_material = url.searchParams.get("mm_material")?.trim();
    const page = Number(url.searchParams.get("page") ?? 1);
    const pageSize = Math.min(Number(url.searchParams.get("pageSize") ?? 50), 200);
    
    let query = supabase
      .from('wh_inventory_balance')
      .select('*', { count: 'exact' })
      .eq('tenant_id', tenant_id);
    
    if (plant_id) {
      query = query.eq('plant_id', plant_id);
    }
    
    if (mm_material) {
      query = query.eq('mm_material', mm_material);
    }
    
    query = query.order('mm_material', { ascending: true });
    
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, count, error } = await query.range(from, to);
    
    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'WH_FETCH_FAILED', message: error.message }
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
      error: { code: 'WH_FETCH_ERROR', message: error.message }
    }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse<WH_InventoryBalance>>> {
  try {
    const tenant_id = await getTenantFromSession();
    const supabase = supabaseServer();
    const body = await req.json();
    
    // VALIDAÇÃO RIGOROSA: Campos obrigatórios do Inventory Balance
    const requiredFields = ['plant_id', 'mm_material'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'WH_MISSING_FIELDS', 
          message: `Inventory Balance - Campos obrigatórios ausentes: ${missingFields.join(', ')}` 
        }
      }, { status: 400 });
    }
    
    // VALIDAÇÃO: NUNCA aceitar tenant_id do payload
    if (body.tenant_id) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'WH_TENANT_FORBIDDEN', 
          message: 'tenant_id é derivado da sessão - não pode ser fornecido no payload' 
        }
      }, { status: 400 });
    }
    
    // VALIDAÇÃO CRÍTICA: NUNCA aceitar quantity_available no payload
    if (body.quantity_available !== undefined) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'WH_FORBIDDEN_FIELD', 
          message: 'quantity_available é uma coluna gerada - não pode ser inserida manualmente' 
        }
      }, { status: 400 });
    }
    
    const balance: Omit<WH_InventoryBalance, 'quantity_available'> = {
      tenant_id,
      plant_id: body.plant_id,                    // OBRIGATÓRIO
      mm_material: body.mm_material,              // OBRIGATÓRIO
      on_hand_qty: body.on_hand_qty ?? null,      // numeric -> string
      reserved_qty: body.reserved_qty ?? null,    // numeric -> string
      last_count_date: body.last_count_date ?? null,
      status: body.status ?? null,
      // quantity_available é gerada automaticamente pelo DB
    };
    
    const { data, error } = await supabase
      .from('wh_inventory_balance')
      .insert(balance)
      .select('*')  // Retorna quantity_available calculada pelo DB
      .single();
    
    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'WH_CREATE_FAILED', message: error.message }
      }, { status: 400 });
    }
    
    return NextResponse.json({
      ok: true,
      data
    }, { status: 201 });
    
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: { code: 'WH_CREATE_ERROR', message: error.message }
    }, { status: 500 });
  }
}

export async function PUT(req: Request): Promise<NextResponse<ApiResponse<WH_InventoryBalance>>> {
  try {
    const tenant_id = await getTenantFromSession();
    const supabase = supabaseServer();
    const body = await req.json();
    
    // Validar campos obrigatórios para update
    const requiredFields = ['plant_id', 'mm_material'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'WH_MISSING_FIELDS', 
          message: `Campos obrigatórios ausentes: ${missingFields.join(', ')}` 
        }
      }, { status: 400 });
    }
    
    // VALIDAÇÃO CRÍTICA: NUNCA aceitar quantity_available no payload
    if (body.quantity_available !== undefined) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'WH_FORBIDDEN_FIELD', 
          message: 'quantity_available é uma coluna gerada - não pode ser atualizada manualmente' 
        }
      }, { status: 400 });
    }
    
    const updateData: Partial<Omit<WH_InventoryBalance, 'quantity_available' | 'tenant_id' | 'plant_id' | 'mm_material'>> = {
      on_hand_qty: body.on_hand_qty ?? undefined,
      reserved_qty: body.reserved_qty ?? undefined,
      last_count_date: body.last_count_date ?? undefined,
      status: body.status ?? undefined,
    };
    
    // Remover campos undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });
    
    const { data, error } = await supabase
      .from('wh_inventory_balance')
      .update(updateData)
      .eq('tenant_id', tenant_id)
      .eq('plant_id', body.plant_id)
      .eq('mm_material', body.mm_material)
      .select('*')  // Retorna quantity_available calculada pelo DB
      .single();
    
    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'WH_UPDATE_FAILED', message: error.message }
      }, { status: 400 });
    }
    
    return NextResponse.json({
      ok: true,
      data
    });
    
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: { code: 'WH_UPDATE_ERROR', message: error.message }
    }, { status: 500 });
  }
}
