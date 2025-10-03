import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'

export async function GET(request: Request) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // month, quarter, year

    // Calcular datas baseado no período
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case 'quarter':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    // 1. Receita MTD (Month-to-Date)
    const { data: revenueData, error: revenueError } = await supabase
      .from('sd_sales_order')
      .select('total_amount_cents')
      .eq('tenant_id', tenantId)
      .eq('status', 'delivered')
      .gte('order_date', startDate.toISOString().split('T')[0])
      .lte('order_date', now.toISOString().split('T')[0])

    if (revenueError) {
      console.error('Error fetching revenue data:', revenueError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: revenueError.code, message: revenueError.message } 
      }, { status: 500 })
    }

    const totalRevenueCents = revenueData?.reduce((sum, order) => sum + (order.total_amount_cents || 0), 0) || 0

    // 2. Pedidos Abertos
    const { count: openOrdersCount, error: openOrdersError } = await supabase
      .from('sd_sales_order')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .not('status', 'in', '(delivered,cancelled)')

    if (openOrdersError) {
      console.error('Error fetching open orders count:', openOrdersError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: openOrdersError.code, message: openOrdersError.message } 
      }, { status: 500 })
    }

    // 3. Ticket Médio
    const { data: ticketData, error: ticketError } = await supabase
      .from('sd_sales_order')
      .select('total_amount_cents')
      .eq('tenant_id', tenantId)
      .eq('status', 'delivered')

    if (ticketError) {
      console.error('Error fetching ticket data:', ticketError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: ticketError.code, message: ticketError.message } 
      }, { status: 500 })
    }

    let averageTicketCents = 0
    if (ticketData && ticketData.length > 0) {
      const totalTicketCents = ticketData.reduce((sum, order) => sum + (order.total_amount_cents || 0), 0)
      averageTicketCents = totalTicketCents / ticketData.length
    }

    // 4. Total de Clientes
    const { count: customersCount, error: customersError } = await supabase
      .from('crm_customer')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)

    if (customersError) {
      console.error('Error fetching customers count:', customersError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: customersError.code, message: customersError.message } 
      }, { status: 500 })
    }

    // 5. Total de Pedidos no Período
    const { count: totalOrdersCount, error: totalOrdersError } = await supabase
      .from('sd_sales_order')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gte('order_date', startDate.toISOString().split('T')[0])
      .lte('order_date', now.toISOString().split('T')[0])

    if (totalOrdersError) {
      console.error('Error fetching total orders count:', totalOrdersError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: totalOrdersError.code, message: totalOrdersError.message } 
      }, { status: 500 })
    }

    const kpis = {
      revenue: {
        total_cents: totalRevenueCents,
        total_brl: totalRevenueCents / 100,
        period: period,
        start_date: startDate.toISOString().split('T')[0],
        end_date: now.toISOString().split('T')[0]
      },
      open_orders: {
        count: openOrdersCount || 0
      },
      average_ticket: {
        total_cents: Math.round(averageTicketCents),
        total_brl: Math.round(averageTicketCents) / 100,
        sample_size: ticketData?.length || 0
      },
      customers: {
        total_count: customersCount || 0
      },
      orders_period: {
        total_count: totalOrdersCount || 0,
        period: period
      }
    }

    return NextResponse.json({ ok: true, data: kpis })
  } catch (error: any) {
    console.error('Unhandled error in GET /api/sd/kpis:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}
