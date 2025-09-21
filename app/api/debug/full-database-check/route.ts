import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    const results: { [key: string]: any } = {}

    // Lista de todas as tabelas principais do ERP
    const tables = [
      'mm_material',
      'mm_vendor', 
      'mm_purchase_order',
      'mm_purchase_order_item',
      'mm_receiving',
      'crm_customer',
      'crm_lead',
      'crm_opportunity',
      'crm_interaction',
      'sd_sales_order',
      'sd_sales_order_item',
      'sd_payment',
      'sd_shipment',
      'wh_inventory_balance',
      'wh_inventory_ledger',
      'wh_warehouse',
      'fi_account',
      'fi_invoice',
      'fi_payment',
      'fi_transaction',
      'co_cost_center',
      'co_kpi_definition',
      'co_kpi_snapshot',
      'app_setting',
      'tenant',
      'user_profile'
    ]

    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .eq('tenant_id', tenantId)
          .limit(10) // Limita a 10 registros para não sobrecarregar

        results[table] = {
          data: data || [],
          error: error?.message || null,
          count: count || 0,
          hasData: (data && data.length > 0) || false
        }
      } catch (err) {
        results[table] = {
          data: [],
          error: err instanceof Error ? err.message : 'Unknown error',
          count: 0,
          hasData: false
        }
      }
    }

    // Verificar também sem filtro de tenant para ver se há dados de outros tenants
    const allTenantsResults: { [key: string]: any } = {}
    
    for (const table of ['mm_material', 'mm_vendor', 'crm_customer']) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('tenant_id', { count: 'exact' })
          .limit(50)

        allTenantsResults[table] = {
          data: data || [],
          error: error?.message || null,
          count: count || 0,
          tenants: data ? [...new Set(data.map((r: any) => r.tenant_id))] : []
        }
      } catch (err) {
        allTenantsResults[table] = {
          data: [],
          error: err instanceof Error ? err.message : 'Unknown error',
          count: 0,
          tenants: []
        }
      }
    }

    return NextResponse.json({
      success: true,
      tenantId: tenantId,
      connection: 'OK',
      tablesWithTenantFilter: results,
      allTenantsData: allTenantsResults,
      summary: {
        tablesWithData: Object.keys(results).filter(k => results[k].hasData),
        totalRecords: Object.values(results).reduce((sum: number, r: any) => sum + (r.count || 0), 0)
      }
    })
  } catch (error: any) {
    console.error('Full database check failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.stack,
      },
      { status: 500 }
    )
  }
}
