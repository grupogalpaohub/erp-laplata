import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/utils/supabase/server';
import { z } from 'zod';

// Schema baseado no Inventário 360° real
const FI_TransactionSchema = z.object({
  transaction_id: z.string().min(1),
  account_id: z.string().min(1),
  type: z.enum(['debito', 'credito']),  // Enum real do banco
  amount_cents: z.number().int(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().optional(),
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

    const parse = FI_TransactionSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({
        ok: false,
        error: { code: 'FI_INVALID_TYPE', message: parse.error.message }
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

    // Validar FK account_id
    const { data: account, error: accountError } = await supabase
      .from('fi_account')
      .select('account_id')
      .eq('tenant_id', tenant_id)
      .eq('account_id', dto.account_id)
      .single();

    if (accountError || !account) {
      return NextResponse.json({
        ok: false,
        error: { code: 'FK_NOT_FOUND', message: 'account_id inexistente' }
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('fi_transaction')
      .insert({
        tenant_id,
        transaction_id: dto.transaction_id,
        account_id: dto.account_id,
        type: dto.type,
        amount_cents: dto.amount_cents,
        date: dto.date,
        description: dto.description,
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
      .from('fi_transaction')
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
