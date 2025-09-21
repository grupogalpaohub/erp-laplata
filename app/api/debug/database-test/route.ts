import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    console.log('[DEBUG] Tenant ID:', tenantId)

    // Testar conexão básica
    const { data: connectionTest, error: connectionError } = await supabase
      .from('mm_vendor')
      .select('count')
      .limit(1)

    if (connectionError) {
      console.error('[DEBUG] Connection error:', connectionError)
      return NextResponse.json({
        success: false,
        error: connectionError.message,
        tenantId
      })
    }

    // Testar tabelas principais
    const [materialsResult, vendorsResult, customersResult] = await Promise.allSettled([
      supabase
        .from('mm_material')
        .select('mm_material, mm_comercial, mm_desc')
        .eq('tenant_id', tenantId)
        .limit(5),
      supabase
        .from('mm_vendor')
        .select('vendor_id, vendor_name, email')
        .eq('tenant_id', tenantId)
        .limit(5),
      supabase
        .from('crm_customer')
        .select('customer_id, name, email')
        .eq('tenant_id', tenantId)
        .limit(5)
    ])

    const materials = materialsResult.status === 'fulfilled' ? materialsResult.value : null
    const vendors = vendorsResult.status === 'fulfilled' ? vendorsResult.value : null
    const customers = customersResult.status === 'fulfilled' ? customersResult.value : null

    return NextResponse.json({
      success: true,
      tenantId,
      connection: 'OK',
      tables: {
        materials: {
          data: materials?.data || [],
          error: materials?.error || null,
          count: materials?.data?.length || 0
        },
        vendors: {
          data: vendors?.data || [],
          error: vendors?.error || null,
          count: vendors?.data?.length || 0
        },
        customers: {
          data: customers?.data || [],
          error: customers?.error || null,
          count: customers?.data?.length || 0
        }
      }
    })

  } catch (error) {
    console.error('[DEBUG] Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
