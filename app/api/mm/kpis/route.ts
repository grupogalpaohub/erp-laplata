import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'

// Forçar Node.js runtime para APIs que usam Supabase
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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

    // 1. Gasto MTD (Month-to-Date)
    const { data: spendingData, error: spendingError } = await supabase
      .from('mm_purchase_order_item')
      .select(`
        line_total_cents,
        mm_purchase_order!inner(order_date, status)
      `)
      .eq('tenant_id', tenantId)
      .gte('mm_purchase_order.order_date', startDate.toISOString().split('T')[0])
      .lte('mm_purchase_order.order_date', now.toISOString().split('T')[0])

    if (spendingError) {
      console.error('Error fetching spending data:', spendingError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: spendingError.code, message: spendingError.message } 
      }, { status: 500 })
    }

    const totalSpendingCents = spendingData?.reduce((sum, item) => sum + (item.line_total_cents || 0), 0) || 0

    // 2. Pedidos Abertos
    const { count: openOrdersCount, error: openOrdersError } = await supabase
      .from('mm_purchase_order')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('status', 'draft')

    if (openOrdersError) {
      console.error('Error fetching open orders count:', openOrdersError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: openOrdersError.code, message: openOrdersError.message } 
      }, { status: 500 })
    }

    // 3. Lead Time Médio (dias)
    const { data: leadTimeData, error: leadTimeError } = await supabase
      .from('mm_receiving')
      .select(`
        received_at,
        mm_purchase_order!inner(order_date, status)
      `)
      .eq('tenant_id', tenantId)
      .eq('mm_purchase_order.status', 'received')

    if (leadTimeError) {
      console.error('Error fetching lead time data:', leadTimeError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: leadTimeError.code, message: leadTimeError.message } 
      }, { status: 500 })
    }

    let averageLeadTimeDays = 0
    if (leadTimeData && leadTimeData.length > 0) {
      const leadTimes = leadTimeData.map(item => {
        const orderDate = new Date((item.mm_purchase_order as any).order_date)
        const receivedDate = new Date(item.received_at)
        return Math.ceil((receivedDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))
      }).filter(days => days >= 0)
      
      averageLeadTimeDays = leadTimes.length > 0 
        ? leadTimes.reduce((sum, days) => sum + days, 0) / leadTimes.length 
        : 0
    }

    // 4. Total de Materiais
    const { count: materialsCount, error: materialsError } = await supabase
      .from('mm_material')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)

    if (materialsError) {
      console.error('Error fetching materials count:', materialsError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: materialsError.code, message: materialsError.message } 
      }, { status: 500 })
    }

    // 5. Total de Fornecedores
    const { count: vendorsCount, error: vendorsError } = await supabase
      .from('mm_vendor')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)

    if (vendorsError) {
      console.error('Error fetching vendors count:', vendorsError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: vendorsError.code, message: vendorsError.message } 
      }, { status: 500 })
    }

    const kpis = {
      spending: {
        total_cents: totalSpendingCents,
        total_brl: totalSpendingCents / 100,
        period: period,
        start_date: startDate.toISOString().split('T')[0],
        end_date: now.toISOString().split('T')[0]
      },
      open_orders: {
        count: openOrdersCount || 0
      },
      lead_time: {
        average_days: Math.round(averageLeadTimeDays * 10) / 10,
        sample_size: leadTimeData?.length || 0
      },
      inventory: {
        materials_count: materialsCount || 0,
        vendors_count: vendorsCount || 0
      }
    }

    return NextResponse.json({ ok: true, data: kpis })
  } catch (error: any) {
    console.error('Unhandled error in GET /api/mm/kpis:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}