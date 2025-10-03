import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { z } from 'zod';

// Schema baseado no Inventário 360° real - so_id será gerado pelo DB
const CreateSOBody = z.object({
  customer_id: z.string().min(1),
  order_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  expected_ship: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  payment_method: z.string().optional(),
  payment_term: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = supabaseServer();

    const body = await req.json();
    
    // GUARDRAIL: Bloquear tenant_id do payload
    if ('tenant_id' in body) {
      return NextResponse.json({
        ok: false,
        error: { code: 'TENANT_FORBIDDEN', message: 'tenant_id não pode vir do payload' }
      }, { status: 400 });
    }

    const parse = CreateSOBody.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({
        ok: false,
        error: { code: 'SO_INVALID_STATUS', message: parse.error.message }
      }, { status: 400 });
    }

    const dto = parse.data;
    
    // GUARDRAIL: Verificar autenticação via supabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({
        ok: false,
        error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado' }
      }, { status: 401 });
    }

    // Validar FK customer_id - RLS filtra automaticamente por tenant_id
    const { data: customer, error: customerError } = await supabase
      .from('crm_customer')
      .select('customer_id')
      .eq('customer_id', dto.customer_id)
      .single();

    if (customerError || !customer) {
      return NextResponse.json({
        ok: false,
        error: { code: 'FK_NOT_FOUND', message: 'customer_id inexistente' }
      }, { status: 400 });
    }

    // GUARDRAIL: Não enviar so_id - será gerado pelo trigger do DB
    // RLS filtra automaticamente por tenant_id
    const { data, error: insertError } = await supabase
      .from('sd_sales_order')
      .insert({
        customer_id: dto.customer_id,
        order_date: dto.order_date,
        expected_ship: dto.expected_ship,
        payment_method: dto.payment_method,
        payment_term: dto.payment_term,
        notes: dto.notes,
        status: 'draft',
        total_final_cents: 0,
      })
      .select('so_id, customer_id, order_date, expected_ship, payment_method, payment_term, notes, status, total_final_cents')
      .single();

    if (insertError) {
      return NextResponse.json({
        ok: false,
        error: { code: 'DB_ERROR', message: insertError.message }
      }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data });

  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: { code: 'DB_ERROR', message: 'Erro interno do servidor' }
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = supabaseServer();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || 20)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // GUARDRAIL: Verificar autenticação via supabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({
        ok: false,
        error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado' }
      }, { status: 401 });
    }

    // RLS filtra automaticamente por tenant_id
    const { data, count, error: queryError } = await supabase
      .from('sd_sales_order')
      .select('*', { count: 'exact' })
      .range(from, to);

    if (queryError) {
      return NextResponse.json({
        ok: false,
        error: { code: 'DB_ERROR', message: queryError.message }
      }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      data: data || [],
      total: count || 0,
      page,
      pageSize
    });

  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: { code: 'DB_ERROR', message: 'Erro interno do servidor' }
    }, { status: 500 });
  }
}
