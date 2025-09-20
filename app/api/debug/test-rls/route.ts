export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
        },
      }
    )

    // Teste 1: Verificar se há políticas RLS ativas
    let rlsInfo = null
    let rlsError = null
    try {
      const result = await supabase
        .rpc('get_rls_policies', { table_name: 'mm_material' })
      rlsInfo = result.data
      rlsError = result.error
    } catch (err) {
      rlsError = 'RPC not available'
    }

    // Teste 2: Tentar buscar com diferentes estratégias
    const { data: strategy1, error: error1 } = await supabase
      .from('mm_material')
      .select('*')
      .limit(1)

    const { data: strategy2, error: error2 } = await supabase
      .from('mm_material')
      .select('mm_material, tenant_id')
      .eq('tenant_id', 'LaplataLunaria')
      .limit(1)

    const { data: strategy3, error: error3 } = await supabase
      .from('mm_material')
      .select('mm_material')
      .limit(1)

    // Teste 3: Verificar se consegue acessar outras tabelas
    const { data: vendors, error: vendorError } = await supabase
      .from('mm_vendor')
      .select('vendor_id, tenant_id')
      .limit(1)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      rls: {
        info: rlsInfo,
        error: typeof rlsError === 'string' ? rlsError : rlsError?.message || 'RPC not available',
      },
      strategies: {
        strategy1: {
          count: strategy1?.length || 0,
          data: strategy1,
          error: error1?.message,
        },
        strategy2: {
          count: strategy2?.length || 0,
          data: strategy2,
          error: error2?.message,
        },
        strategy3: {
          count: strategy3?.length || 0,
          data: strategy3,
          error: error3?.message,
        },
      },
      otherTables: {
        vendors: {
          count: vendors?.length || 0,
          data: vendors,
          error: vendorError?.message,
        },
      },
      recommendations: [
        'Verificar políticas RLS na tabela mm_material',
        'Verificar se a chave anon tem permissões adequadas',
        'Considerar usar service_role key para operações administrativas',
        'Verificar se há políticas que filtram por tenant_id'
      ]
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
