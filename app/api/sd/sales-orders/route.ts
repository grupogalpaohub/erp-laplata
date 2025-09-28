// app/api/sd/sales-orders/route.ts
// API para Sales Orders usando campos CORRETOS do schema real
// GUARDRAIL COMPLIANCE: @supabase/ssr + cookies()

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/utils/supabase/server';
import { getTenantFromSession } from '@/utils/supabase/tenant';
import { SD_SalesOrder, ApiResponse, PaginatedResponse } from '@/src/types/db';

export async function GET(req: Request): Promise<NextResponse<PaginatedResponse<SD_SalesOrder>>> {
  try {
    const tenant_id = await getTenantFromSession();
    const supabase = supabaseServer();
    
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim() ?? "";
    const page = Number(url.searchParams.get("page") ?? 1);
    const pageSize = Math.min(Number(url.searchParams.get("pageSize") ?? 50), 200);
    
    let query = supabase
      .from('sd_sales_order')
      .select('*', { count: 'exact' })
      .eq('tenant_id', tenant_id)
      .order('order_date', { ascending: false });
    
    if (q) {
      query = query.or(`so_id.ilike.%${q}%,doc_no.ilike.%${q}%,customer_id.ilike.%${q}%`);
    }
    
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, count, error } = await query.range(from, to);
    
    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'SO_FETCH_FAILED', message: error.message }
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
      error: { code: 'SO_FETCH_ERROR', message: error.message }
    }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse<SD_SalesOrder>>> {
  try {
    const tenant_id = await getTenantFromSession();
    const supabase = supabaseServer();
    const body = await req.json();
    
    // VALIDAÇÃO RIGOROSA: Campos obrigatórios do Sales Order
    const requiredFields = ['so_id', 'customer_id'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'SO_MISSING_FIELDS', 
          message: `Sales Order - Campos obrigatórios ausentes: ${missingFields.join(', ')}` 
        }
      }, { status: 400 });
    }
    
    // VALIDAÇÃO: Status enum padronizado
    if (body.status && !['draft', 'approved', 'invoiced', 'cancelled'].includes(body.status)) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'INVALID_STATUS', 
          message: 'Status inválido. Valores aceitos: draft, approved, invoiced, cancelled' 
        }
      }, { status: 400 });
    }
    
    // VALIDAÇÃO: NUNCA aceitar tenant_id do payload
    if (body.tenant_id) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'SO_TENANT_FORBIDDEN', 
          message: 'tenant_id é derivado da sessão - não pode ser fornecido no payload' 
        }
      }, { status: 400 });
    }
    
    // VALIDAÇÃO: NUNCA aceitar total_final_cents do payload (calculado por trigger)
    if (body.total_final_cents !== undefined) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'SO_FORBIDDEN_FIELD', 
          message: 'total_final_cents é calculado automaticamente pela trigger do banco' 
        }
      }, { status: 400 });
    }
    
    // VALIDAÇÃO: Formato de data se fornecida
    if (body.order_date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(body.order_date)) {
        return NextResponse.json({
          ok: false,
          error: { 
            code: 'SO_INVALID_DATE', 
            message: 'order_date deve estar no formato yyyy-mm-dd' 
          }
        }, { status: 400 });
      }
    }
    
    // Gerar doc_no se não fornecido
    let doc_no = body.doc_no;
    if (!doc_no) {
      // Usar função do DB para gerar número do documento
      const { data: docData, error: docError } = await supabase
        .rpc('next_doc_number', { 
          p_tenant_id: tenant_id, 
          p_doc_type: 'SD_SO' 
        });
      
      if (docError) {
        return NextResponse.json({
          ok: false,
          error: { code: 'SO_DOC_NUMBER_FAILED', message: docError.message }
        }, { status: 400 });
      }
      
      doc_no = docData;
    }
    
    const so: SD_SalesOrder = {
      tenant_id,
      so_id: body.so_id,                        // OBRIGATÓRIO
      customer_id: body.customer_id,            // OBRIGATÓRIO
      status: body.status ?? null,
      order_date: body.order_date ?? null,
      expected_ship: body.expected_ship ?? null,
      total_cents: body.total_cents ?? null,
      doc_no: doc_no,
      payment_method: body.payment_method ?? null,
      payment_term: body.payment_term ?? null,
      total_final_cents: body.total_final_cents ?? null,
      total_negotiated_cents: body.total_negotiated_cents ?? null,
      notes: body.notes ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('sd_sales_order')
      .insert(so)
      .select('*')
      .single();
    
    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'SO_CREATE_FAILED', message: error.message }
      }, { status: 400 });
    }
    
    return NextResponse.json({
      ok: true,
      data
    }, { status: 201 });
    
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: { code: 'SO_CREATE_ERROR', message: error.message }
    }, { status: 500 });
  }
}
