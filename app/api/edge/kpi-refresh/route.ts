import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// IMPORTANTE: runtime Node (não edge) para acesso a env segura
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const svc = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only

    const admin = createClient(url, svc, { auth: { persistSession: false } });

    // Get tenant_id from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await admin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid token');
    }

    const tenantId = user.user_metadata?.tenant_id;
    if (!tenantId) {
      throw new Error('tenant_id not found in user metadata');
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const thisMonth = now.toISOString().substring(0, 7); // YYYY-MM

    // Calculate KPIs
    const kpis = await calculateKPIs(admin, tenantId, today, thisMonth);

    // Store KPI snapshots
    const snapshots = Object.entries(kpis).map(([key, value]) => ({
      tenant_id: tenantId,
      kpi_key: key,
      kpi_value: value,
      snapshot_at: now.toISOString(),
      created_at: now.toISOString()
    }));

    const { error: insertError } = await admin
      .from('co_kpi_snapshot')
      .insert(snapshots);

    if (insertError) throw insertError;

    return NextResponse.json({
      success: true,
      data: {
        kpis,
        snapshot_at: now.toISOString()
      }
    });

  } catch (error: any) {
    console.error('KPI refresh error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

async function calculateKPIs(supabaseClient: any, tenantId: string, today: string, thisMonth: string) {
  const kpis: { [key: string]: number } = {};

  try {
    // KPI: Orders today
    const { count: ordersToday } = await supabaseClient
      .from('sd_sales_order')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('order_date', today);

    kpis.kpi_orders_today = ordersToday || 0;

    // KPI: Month revenue (in cents)
    const { data: revenueData } = await supabaseClient
      .from('sd_sales_order')
      .select('total_amount')
      .eq('tenant_id', tenantId)
      .gte('order_date', `${thisMonth}-01`)
      .lt('order_date', `${thisMonth}-32`);

    kpis.kpi_month_revenue_cents = revenueData?.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0) || 0;

    // KPI: Active leads
    const { count: activeLeads } = await supabaseClient
      .from('crm_lead')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .in('status', ['new', 'contacted', 'qualified']);

    kpis.kpi_active_leads = activeLeads || 0;

    // KPI: Stock critical count (items with stock below min_stock)
    const { data: criticalStock } = await supabaseClient
      .from('wh_inventory_balance')
      .select(`
        sku,
        quantity_on_hand,
        mm_material!inner(min_stock)
      `)
      .eq('tenant_id', tenantId)
      .eq('status', 'active');

    const criticalCount = criticalStock?.filter((item: any) => 
      item.quantity_on_hand <= (item.mm_material?.min_stock || 0)
    ).length || 0;

    kpis.kpi_stock_critical_count = criticalCount;

  } catch (error) {
    console.error('Error calculating KPIs:', error);
    // Return default values on error
    kpis.kpi_orders_today = 0;
    kpis.kpi_month_revenue_cents = 0;
    kpis.kpi_active_leads = 0;
    kpis.kpi_stock_critical_count = 0;
  }

  return kpis;
}
