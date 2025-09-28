import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { z } from 'zod';

// Schema baseado no Inventário 360° real - mm_order será gerado pelo DB
const CreatePOBody = z.object({
  vendor_id: z.string().min(1),
  order_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  expected_delivery: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
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

    const parse = CreatePOBody.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({
        ok: false,
        error: { code: 'MM_MISSING_FIELDS', message: parse.error.message }
      }, { status: 400 });
    }

    const dto = parse.data;
    
    // GUARDRAIL: Derivar tenant_id da sessão
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      return NextResponse.json({
        ok: false,
        error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado' }
      }, { status: 401 });
    }
    
    const tenant_id = session.session.user.user_metadata?.tenant_id || 'LaplataLunaria';

    // Validar FK vendor_id
    const { data: vendor, error: vendorError } = await supabase
      .from('mm_vendor')
      .select('vendor_id')
      .eq('tenant_id', tenant_id)
      .eq('vendor_id', dto.vendor_id)
      .single();

    if (vendorError || !vendor) {
      return NextResponse.json({
        ok: false,
        error: { code: 'FK_NOT_FOUND', message: 'vendor_id inexistente' }
      }, { status: 400 });
    }

    // GUARDRAIL: Não enviar mm_order - será gerado pelo trigger do DB
    const { data, error } = await supabase
      .from('mm_purchase_order')
      .insert({
        tenant_id,
        vendor_id: dto.vendor_id,
        order_date: dto.order_date,
        expected_delivery: dto.expected_delivery,
        notes: dto.notes,
        status: 'draft',
        currency: 'BRL',
        total_cents: 0,
      })
      .select('tenant_id, mm_order, vendor_id, order_date, expected_delivery, notes, status, total_cents')
      .single();

    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'DB_ERROR', message: error.message }
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

    // GUARDRAIL: Derivar tenant_id da sessão
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      return NextResponse.json({
        ok: false,
        error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado' }
      }, { status: 401 });
    }
    
    const tenant_id = session.session.user.user_metadata?.tenant_id || 'LaplataLunaria';

    const { data, count, error } = await supabase
      .from('mm_purchase_order')
      .select('*', { count: 'exact' })
      .eq('tenant_id', tenant_id)
      .range(from, to);

    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'DB_ERROR', message: error.message }
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