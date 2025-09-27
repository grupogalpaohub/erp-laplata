import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { getSupabaseServerClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    // MIGRADO PARA: app/api/edge/kpi-refresh/route.ts
    // const supabaseClient = getSupabaseServerClient(
    //   Deno.env.get('SUPABASE_URL') ?? '',
    //   Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    // )
    throw new Error('This edge function has been migrated to app/api/edge/kpi-refresh/route.ts')

    // Get tenant_id from JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authorization header required')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid token')
    }

    const tenantId = user.user_metadata?.tenant_id
    if (!tenantId) {
      throw new Error('tenant_id not found in user metadata')
    }
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const thisMonth = now.toISOString().substring(0, 7) // YYYY-MM

    // Calculate KPIs
    const kpis = await calculateKPIs(supabaseClient, tenantId, today, thisMonth)

    // Store KPI snapshots
    const snapshots = Object.entries(kpis).map(([key, value]) => ({
      tenant_id: tenantId,
      kpi_key: key,
      kpi_value: value,
      snapshot_at: now.toISOString(),
      created_at: now.toISOString()
    }))

    const { error: insertError } = await supabaseClient
      .from('co_kpi_snapshot')
      .insert(snapshots)

    if (insertError) throw insertError

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          kpis,
          snapshot_at: now.toISOString()
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('KPI refresh error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function calculateKPIs(supabaseClient: any, tenantId: string, today: string, thisMonth: string) {
  const kpis: { [key: string]: number } = {}

  try {
    // KPI: Orders today
    const { count: ordersToday } = await supabaseClient
      .from('sd_sales_order')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('order_date', today)

    kpis.kpi_orders_today = ordersToday || 0

    // KPI: Month revenue (in cents)
    const { data: revenueData } = await supabaseClient
      .from('sd_sales_order')
      .select('total_amount')
      .eq('tenant_id', tenantId)
      .gte('order_date', `${thisMonth}-01`)
      .lt('order_date', `${thisMonth}-32`)

    kpis.kpi_month_revenue_cents = revenueData?.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0) || 0

    // KPI: Active leads
    const { count: activeLeads } = await supabaseClient
      .from('crm_lead')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .in('status', ['new', 'contacted', 'qualified'])

    kpis.kpi_active_leads = activeLeads || 0

    // KPI: Stock critical count (items with stock below min_stock)
    const { data: criticalStock } = await supabaseClient
      .from('wh_inventory_balance')
      .select(`
        sku,
        quantity_on_hand,
        mm_material!inner(min_stock)
      `)
      .eq('tenant_id', tenantId)
      .eq('status', 'active')

    const criticalCount = criticalStock?.filter((item: any) => 
      item.quantity_on_hand <= (item.mm_material?.min_stock || 0)
    ).length || 0

    kpis.kpi_stock_critical_count = criticalCount

  } catch (error) {
    console.error('Error calculating KPIs:', error)
    // Return default values on error
    kpis.kpi_orders_today = 0
    kpis.kpi_month_revenue_cents = 0
    kpis.kpi_active_leads = 0
    kpis.kpi_stock_critical_count = 0
  }

  return kpis
}

