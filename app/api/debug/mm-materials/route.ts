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

    // Teste 1: Contar total de materiais
    const { count, error: countError } = await supabase
      .from('mm_material')
      .select('*', { count: 'exact', head: true })

    // Teste 2: Buscar materiais com filtro por tenant
    const { data, error } = await supabase
      .from('mm_material')
      .select('mm_material, mm_comercial, mm_desc, mm_mat_type, mm_mat_class, mm_price_cents, commercial_name, lead_time_days, mm_vendor_id, status')
      .eq('tenant_id', 'LaplataLunaria')
      .order('mm_material', { ascending: true })

    // Teste 3: Buscar todos os materiais (sem filtro)
    const { data: allData, error: allError } = await supabase
      .from('mm_material')
      .select('mm_material, tenant_id, mm_mat_type, mm_mat_class')
      .limit(10)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: {
        total: count,
        error: countError?.message,
      },
      filtered: {
        data: data?.length || 0,
        materials: data,
        error: error?.message,
      },
      all: {
        data: allData?.length || 0,
        materials: allData,
        error: allError?.message,
      },
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
