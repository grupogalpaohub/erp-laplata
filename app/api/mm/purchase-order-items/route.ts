import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Schema baseado no Inventário 360° real
const PoItemSchema = z.object({
  mm_order: z.string().min(1),
  plant_id: z.string().min(1),
  mm_material: z.string().min(1),
  mm_qtt: z.number(),
  unit_cost_cents: z.number().int(),
  line_total_cents: z.number().int().optional(),
  freeze_item_price: z.boolean().optional(),
  currency: z.string().optional(),
  notes: z.string().optional(),
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

    const parse = PoItemSchema.safeParse(body);
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

    // Validar FK mm_order
    const { data: po, error: poError } = await supabase
      .from('mm_purchase_order')
      .select('mm_order')
      .eq('tenant_id', tenant_id)
      .eq('mm_order', dto.mm_order)
      .single();

    if (poError || !po) {
      return NextResponse.json({
        ok: false,
        error: { code: 'FK_NOT_FOUND', message: 'mm_order inexistente' }
      }, { status: 400 });
    }

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
        error: { code: 'FK_NOT_FOUND', message: 'mm_material inexistente' }
      }, { status: 400 });
    }

    // Calcular line_total_cents se não fornecido
    const line_total_cents = dto.line_total_cents || (dto.mm_qtt * dto.unit_cost_cents);

    const { data, error } = await supabase
      .from('mm_purchase_order_item')
      .insert({
        tenant_id,
        mm_order: dto.mm_order,
        plant_id: dto.plant_id,
        mm_material: dto.mm_material,
        mm_qtt: dto.mm_qtt,
        unit_cost_cents: dto.unit_cost_cents,
        line_total_cents,
        freeze_item_price: dto.freeze_item_price,
        currency: dto.currency,
        notes: dto.notes,
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
    const mm_order = searchParams.get('mm_order');
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

    let query = supabase
      .from('mm_purchase_order_item')
      .select('*', { count: 'exact' })
      .eq('tenant_id', tenant_id)
      .range(from, to);

    if (mm_order) {
      query = query.eq('mm_order', mm_order);
    }

    const { data, count, error } = await query;

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