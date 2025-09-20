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

    // Verificar se a tabela existe e tem dados
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['mm_material', 'mm_vendor', 'wh_warehouse'])

    // Verificar dados em cada tabela
    const { data: materials, error: materialsError } = await supabase
      .from('mm_material')
      .select('mm_material, tenant_id')
      .limit(5)

    const { data: vendors, error: vendorsError } = await supabase
      .from('mm_vendor')
      .select('vendor_id, tenant_id')
      .limit(5)

    const { data: warehouses, error: warehousesError } = await supabase
      .from('wh_warehouse')
      .select('plant_id, tenant_id')
      .limit(5)

    // Verificar se há dados do tenant LaplataLunaria
    const { data: tenantData, error: tenantError } = await supabase
      .from('tenant')
      .select('tenant_id, display_name')
      .eq('tenant_id', 'LaplataLunaria')

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tables: {
        found: tables?.map(t => t.table_name) || [],
        error: tablesError?.message,
      },
      data: {
        materials: {
          count: materials?.length || 0,
          data: materials,
          error: materialsError?.message,
        },
        vendors: {
          count: vendors?.length || 0,
          data: vendors,
          error: vendorsError?.message,
        },
        warehouses: {
          count: warehouses?.length || 0,
          data: warehouses,
          error: warehousesError?.message,
        },
        tenant: {
          data: tenantData,
          error: tenantError?.message,
        },
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
