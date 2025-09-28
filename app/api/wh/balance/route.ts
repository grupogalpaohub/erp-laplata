import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Schema baseado no Inventário 360° real
const WH_InventoryBalanceSchema = z.object({
  plant_id: z.string().min(1),
  mm_material: z.string().min(1),
  on_hand_qty: z.number().int(),
  reserved_qty: z.number().int(),
  status: z.string().optional(),
  last_count_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  // quantity_available é READ-ONLY - não aceitar no payload
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

    // GUARDRAIL: Bloquear quantity_available (coluna gerada)
    if ('quantity_available' in body) {
      return NextResponse.json({
        ok: false,
        error: { code: 'WH_FORBIDDEN_FIELD', message: 'quantity_available é coluna gerada' }
      }, { status: 400 });
    }

    const parse = WH_InventoryBalanceSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({
        ok: false,
        error: { code: 'VALIDATION_ERROR', message: parse.error.message }
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

    const { data, error } = await supabase
      .from('wh_inventory_balance')
      .upsert({
        tenant_id,
        plant_id: dto.plant_id,
        mm_material: dto.mm_material,
        on_hand_qty: dto.on_hand_qty,
        reserved_qty: dto.reserved_qty,
        status: dto.status,
        last_count_date: dto.last_count_date,
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
      .from('wh_inventory_balance')
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