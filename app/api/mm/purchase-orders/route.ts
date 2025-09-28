import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Schema baseado no Inventário 360° real
const PoHeaderSchema = z.object({
  mm_order: z.string().min(1),
  vendor_id: z.string().min(1),
  order_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  po_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  expected_delivery: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  currency: z.string().optional(),
  total_cents: z.number().int().optional(),
  total_amount: z.number().int().optional(),
  notes: z.string().optional(),
  status: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (k) => cookieStore.get(k)?.value } }
    );

    const body = await req.json();
    
    // GUARDRAIL: Bloquear tenant_id do payload
    if ('tenant_id' in body) {
      return NextResponse.json({
        ok: false,
        error: { code: 'TENANT_FORBIDDEN', message: 'tenant_id não pode vir do payload' }
      }, { status: 400 });
    }

    const parse = PoHeaderSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({
        ok: false,
        error: { code: 'MM_MISSING_FIELDS', message: parse.error.message }
      }, { status: 400 });
    }

    const dto = parse.data;
    const tenant_id = 'LaplataLunaria'; // TODO: derivar da sessão

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

    const { data, error } = await supabase
      .from('mm_purchase_order')
      .insert({
        tenant_id,
        mm_order: dto.mm_order,
        vendor_id: dto.vendor_id,
        order_date: dto.order_date,
        po_date: dto.po_date,
        expected_delivery: dto.expected_delivery,
        currency: dto.currency,
        total_cents: dto.total_cents,
        total_amount: dto.total_amount,
        notes: dto.notes,
        status: dto.status,
      })
      .select()
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
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (k) => cookieStore.get(k)?.value } }
    );

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || 20)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const tenant_id = 'LaplataLunaria'; // TODO: derivar da sessão

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