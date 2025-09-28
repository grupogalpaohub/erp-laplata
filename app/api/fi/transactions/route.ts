// app/api/fi/transactions/route.ts
// API para Financial Transactions usando campos CORRETOS do schema real
// GUARDRAIL COMPLIANCE: @supabase/ssr + cookies()

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/utils/supabase/server';
import { getTenantFromSession } from '@/utils/supabase/tenant';
import { FI_Transaction, ApiResponse, PaginatedResponse } from '@/src/types/db';

export async function GET(req: Request): Promise<NextResponse<PaginatedResponse<FI_Transaction>>> {
  try {
    const tenant_id = await getTenantFromSession();
    const supabase = supabaseServer();
    
    const url = new URL(req.url);
    const account_id = url.searchParams.get("account_id")?.trim();
    const type = url.searchParams.get("type")?.trim();
    const ref_type = url.searchParams.get("ref_type")?.trim();
    const page = Number(url.searchParams.get("page") ?? 1);
    const pageSize = Math.min(Number(url.searchParams.get("pageSize") ?? 50), 200);
    
    let query = supabase
      .from('fi_transaction')
      .select('*', { count: 'exact' })
      .eq('tenant_id', tenant_id)
      .order('date', { ascending: false });
    
    if (account_id) {
      query = query.eq('account_id', account_id);
    }
    
    if (type) {
      query = query.eq('type', type);
    }
    
    if (ref_type) {
      query = query.eq('ref_type', ref_type);
    }
    
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, count, error } = await query.range(from, to);
    
    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'FI_FETCH_FAILED', message: error.message }
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
      error: { code: 'FI_FETCH_ERROR', message: error.message }
    }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse<FI_Transaction>>> {
  try {
    const tenant_id = await getTenantFromSession();
    const supabase = supabaseServer();
    const body = await req.json();
    
    // VALIDAÇÃO RIGOROSA: Campos obrigatórios da Transaction
    const requiredFields = ['transaction_id', 'account_id', 'type', 'amount_cents'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'FI_MISSING_FIELDS', 
          message: `Financial Transaction - Campos obrigatórios ausentes: ${missingFields.join(', ')}` 
        }
      }, { status: 400 });
    }
    
    // VALIDAÇÃO: NUNCA aceitar tenant_id do payload
    if (body.tenant_id) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'FI_TENANT_FORBIDDEN', 
          message: 'tenant_id é derivado da sessão - não pode ser fornecido no payload' 
        }
      }, { status: 400 });
    }
    
    // Validar enum type
    const validTypes = ['debito', 'credito'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'FI_INVALID_TYPE', 
          message: `Tipo inválido. Valores aceitos: ${validTypes.join(', ')}` 
        }
      }, { status: 400 });
    }
    
    // Validar que amount_cents é um número
    if (typeof body.amount_cents !== 'number') {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'FI_INVALID_AMOUNT', 
          message: 'amount_cents deve ser um número' 
        }
      }, { status: 400 });
    }
    
    const transaction: FI_Transaction = {
      tenant_id,
      transaction_id: body.transaction_id,        // OBRIGATÓRIO
      account_id: body.account_id,                // OBRIGATÓRIO
      type: body.type,                            // OBRIGATÓRIO - enum (debito/credito)
      amount_cents: body.amount_cents,            // OBRIGATÓRIO
      ref_type: body.ref_type ?? null,
      ref_id: body.ref_id ?? null,
      date: body.date ?? new Date().toISOString().split('T')[0], // yyyy-mm-dd
      created_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('fi_transaction')
      .insert(transaction)
      .select('*')
      .single();
    
    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'FI_CREATE_FAILED', message: error.message }
      }, { status: 400 });
    }
    
    return NextResponse.json({
      ok: true,
      data
    }, { status: 201 });
    
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: { code: 'FI_CREATE_ERROR', message: error.message }
    }, { status: 500 });
  }
}

export async function PUT(req: Request): Promise<NextResponse<ApiResponse<FI_Transaction>>> {
  try {
    const tenant_id = await getTenantFromSession();
    const supabase = supabaseServer();
    const body = await req.json();
    
    // Validar campos obrigatórios para update
    const requiredFields = ['transaction_id'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'FI_MISSING_FIELDS', 
          message: `Campos obrigatórios ausentes: ${missingFields.join(', ')}` 
        }
      }, { status: 400 });
    }
    
    // Validar enum type se fornecido
    if (body.type && !['debito', 'credito'].includes(body.type)) {
      return NextResponse.json({
        ok: false,
        error: { 
          code: 'FI_INVALID_TYPE', 
          message: 'Tipo inválido. Valores aceitos: debito, credito' 
        }
      }, { status: 400 });
    }
    
    const updateData: Partial<Omit<FI_Transaction, 'tenant_id' | 'transaction_id' | 'created_at'>> = {
      account_id: body.account_id ?? undefined,
      type: body.type ?? undefined,
      amount_cents: body.amount_cents ?? undefined,
      ref_type: body.ref_type ?? undefined,
      ref_id: body.ref_id ?? undefined,
      date: body.date ?? undefined,
    };
    
    // Remover campos undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });
    
    const { data, error } = await supabase
      .from('fi_transaction')
      .update(updateData)
      .eq('tenant_id', tenant_id)
      .eq('transaction_id', body.transaction_id)
      .select('*')
      .single();
    
    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'FI_UPDATE_FAILED', message: error.message }
      }, { status: 400 });
    }
    
    return NextResponse.json({
      ok: true,
      data
    });
    
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: { code: 'FI_UPDATE_ERROR', message: error.message }
    }, { status: 500 });
  }
}
