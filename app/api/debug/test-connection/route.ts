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

    // Teste 1: Verificar se consegue conectar
    const { data: health, error: healthError } = await supabase
      .from('mm_material')
      .select('count')
      .limit(1)

    // Teste 2: Tentar buscar sem filtro de tenant
    const { data: allMaterials, error: allError } = await supabase
      .from('mm_material')
      .select('mm_material, tenant_id')
      .limit(5)

    // Teste 3: Verificar se há problema de RLS
    const { data: rlsTest, error: rlsError } = await supabase
      .from('mm_material')
      .select('*')
      .limit(1)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      connection: {
        health: health,
        healthError: healthError?.message,
      },
      data: {
        allMaterials: allMaterials?.length || 0,
        materials: allMaterials,
        allError: allError?.message,
      },
      rls: {
        rlsTest: rlsTest?.length || 0,
        rlsError: rlsError?.message,
      },
      env: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
