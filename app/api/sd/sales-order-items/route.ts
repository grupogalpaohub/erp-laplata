import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';

const SD_SalesOrderItemSchema = z.object({
  so_id: z.string().min(1),
  mm_material: z.string().min(1),        // Campo ativo - FK obrigatória
  sku: z.string().optional(),            // Campo legado mantido
  quantity: z.number().positive(),
  unit_price_cents: z.number().int(),
  line_total_cents: z.number().int().optional(),
  row_no: z.number().int().optional(),
  unit_price_cents_at_order: z.number().int().optional(),
  material_id: z.string().optional(),    // Campo legado mantido
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
    
    // Bloquear tenant_id do payload
    if ('tenant_id' in body) {
      return NextResponse.json({
        ok: false,
        error: { code: 'TENANT_FORBIDDEN', message: 'tenant_id não pode vir do payload' }
      }, { status: 400 });
    }

    const parse = SD_SalesOrderItemSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({
        ok: false,
        error: { code: 'VALIDATION_ERROR', message: parse.error.message }
      }, { status: 400 });
    }

    const dto = parse.data;
    const tenant_id = 'LaplataLunaria'; // TODO: derivar da sessão

    // Validar FK mm_material
    const { data: material, error: materialError } = await supabase
      .from('mm_material')
      .select('mm_material')
      .eq('tenant_id', tenant_id)
      .eq('mm_material', dto.mm_material)
      .single();

    if (materialError || !material) {
      return NextResponse.json({
        ok: false,
        error: { code: 'FK_MM_MATERIAL_NOT_FOUND', message: 'mm_material inexistente' }
      }, { status: 400 });
    }

    // Validar FK so_id
    const { data: salesOrder, error: soError } = await supabase
      .from('sd_sales_order')
      .select('so_id')
      .eq('tenant_id', tenant_id)
      .eq('so_id', dto.so_id)
      .single();

    if (soError || !salesOrder) {
      return NextResponse.json({
        ok: false,
        error: { code: 'FK_SO_NOT_FOUND', message: 'so_id inexistente' }
      }, { status: 400 });
    }

    // Calcular line_total_cents se não fornecido
    const line_total_cents = dto.line_total_cents || (dto.quantity * dto.unit_price_cents);

    const { data, error } = await supabase
      .from('sd_sales_order_item')
      .insert({
        tenant_id,
        so_id: dto.so_id,
        mm_material: dto.mm_material,    // Campo ativo
        sku: dto.sku,                    // Campo legado
        quantity: dto.quantity,
        unit_price_cents: dto.unit_price_cents,
        line_total_cents,
        row_no: dto.row_no,
        unit_price_cents_at_order: dto.unit_price_cents_at_order,
        material_id: dto.material_id,    // Campo legado
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'INSERT_FAILED', message: error.message }
      }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data });

  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' }
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
    const so_id = searchParams.get('so_id');
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || 20)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const tenant_id = 'LaplataLunaria'; // TODO: derivar da sessão

    let query = supabase
      .from('sd_sales_order_item')
      .select('*', { count: 'exact' })
      .eq('tenant_id', tenant_id)
      .range(from, to);

    if (so_id) {
      query = query.eq('so_id', so_id);
    }

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json({
        ok: false,
        error: { code: 'QUERY_FAILED', message: error.message }
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
      error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' }
    }, { status: 500 });
  }
}
