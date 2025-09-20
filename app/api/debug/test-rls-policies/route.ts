export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    )

    // Teste 1: Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // Teste 2: Verificar políticas RLS nas tabelas principais
    const tables = ['mm_material', 'mm_vendor', 'wh_warehouse', 'crm_customer']
    const tableResults: any = {}
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(5)
        
        tableResults[table] = {
          success: !error,
          count: data?.length || 0,
          error: error?.message || null,
          data: data || []
        }
      } catch (err) {
        tableResults[table] = {
          success: false,
          count: 0,
          error: err instanceof Error ? err.message : 'Unknown error',
          data: []
        }
      }
    }

    // Teste 3: Verificar se consegue fazer JOIN entre tabelas
    const { data: joinData, error: joinError } = await supabase
      .from('mm_material')
      .select(`
        mm_material,
        mm_desc,
        mm_vendor_id,
        mm_vendor!mm_vendor_id(vendor_name)
      `)
      .eq('tenant_id', 'LaplataLunaria')
      .limit(3)

    // Teste 4: Verificar políticas específicas por role
    const { data: roleData, error: roleError } = await supabase
      .from('mm_material')
      .select('mm_material, mm_desc, status')
      .eq('tenant_id', 'LaplataLunaria')
      .in('status', ['active', 'inactive'])

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      authentication: {
        user: user ? {
          id: user.id,
          email: user.email,
          role: user.user_metadata?.role || 'unknown'
        } : null,
        error: authError?.message || null
      },
      rlsTests: tableResults,
      joinTest: {
        success: !joinError,
        count: joinData?.length || 0,
        error: joinError?.message || null,
        data: joinData || []
      },
      roleTest: {
        success: !roleError,
        count: roleData?.length || 0,
        error: roleError?.message || null,
        data: roleData || []
      },
      recommendations: [
        'Verificar se as políticas RLS estão aplicadas corretamente',
        'Confirmar se o usuário tem o role correto no JWT',
        'Verificar se as políticas permitem acesso aos dados do tenant LaplataLunaria',
        'Testar com diferentes roles (ADMIN, USER, VIEWER)'
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
