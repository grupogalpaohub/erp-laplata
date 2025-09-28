import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
  req: NextRequest,
  { params }: { params: { mm_order: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (k) => cookieStore.get(k)?.value } }
    );

    // GUARDRAIL: Derivar tenant_id da sessão
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      return NextResponse.json({
        ok: false,
        error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado' }
      }, { status: 401 });
    }
    
    const tenant_id = session.session.user.user_metadata?.tenant_id || 'LaplataLunaria';

    // Buscar PO por (tenant_id, mm_order)
    const { data: po, error: poError } = await supabase
      .from('mm_purchase_order')
      .select(`
        *,
        vendor:mm_vendor(vendor_id, vendor_name, email)
      `)
      .eq('tenant_id', tenant_id)
      .eq('mm_order', params.mm_order)
      .single();

    if (poError || !po) {
      return NextResponse.json({
        ok: false,
        error: { code: 'PO_NOT_FOUND', message: 'Pedido de compra não encontrado' }
      }, { status: 404 });
    }

    // Buscar itens do PO com JOIN com mm_material
    const { data: items, error: itemsError } = await supabase
      .from('mm_purchase_order_item')
      .select(`
        *,
        material:mm_material(mm_material, mm_desc, commercial_name)
      `)
      .eq('tenant_id', tenant_id)
      .eq('mm_order', params.mm_order)
      .order('row_no');

    if (itemsError) {
      return NextResponse.json({
        ok: false,
        error: { code: 'DB_ERROR', message: itemsError.message }
      }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      data: {
        ...po,
        items: items || []
      }
    });

  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: { code: 'DB_ERROR', message: 'Erro interno do servidor' }
    }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { mm_order: string } }
) {
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

    // GUARDRAIL: Derivar tenant_id da sessão
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      return NextResponse.json({
        ok: false,
        error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado' }
      }, { status: 401 });
    }
    
    const tenant_id = session.session.user.user_metadata?.tenant_id || 'LaplataLunaria';

    // Atualizar PO
    const { data, error } = await supabase
      .from('mm_purchase_order')
      .update({
        expected_delivery: body.expected_delivery,
        notes: body.notes,
        status: body.status,
      })
      .eq('tenant_id', tenant_id)
      .eq('mm_order', params.mm_order)
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
