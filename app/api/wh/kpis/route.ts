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

    // 1. Total de Materiais em Estoque
    const { count: totalMaterialsCount, error: materialsError } = await supabase
      .from('wh_inventory_balance')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gt('available_qty', 0)

    if (materialsError) {
      console.error('Error fetching total materials count:', materialsError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: materialsError.code, message: materialsError.message } 
      }, { status: 500 })
    }

    // 2. Valor Total do Estoque (simplificado - usando preço médio)
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('wh_inventory_balance')
      .select(`
        available_qty,
        mm_material:mm_material(unit_price_cents)
      `)
      .eq('tenant_id', tenantId)
      .gt('available_qty', 0)

    if (inventoryError) {
      console.error('Error fetching inventory data:', inventoryError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: inventoryError.code, message: inventoryError.message } 
      }, { status: 500 })
    }

    const totalInventoryValueCents = inventoryData?.reduce((sum, item) => {
      const price = (item.mm_material as any)?.unit_price_cents || 0
      return sum + (item.available_qty * price)
    }, 0) || 0

    // 3. Alertas de Estoque Baixo Ativos
    const { count: activeAlertsCount, error: alertsError } = await supabase
      .from('wh_low_stock_alert')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('status', 'active')

    if (alertsError) {
      console.error('Error fetching active alerts count:', alertsError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: alertsError.code, message: alertsError.message } 
      }, { status: 500 })
    }

    // 4. Total de Movimentos no Período
    const { count: movementsCount, error: movementsError } = await supabase
      .from('wh_inventory_ledger')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gte('created_at', startDate.toISOString())

    if (movementsError) {
      console.error('Error fetching movements count:', movementsError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: movementsError.code, message: movementsError.message } 
      }, { status: 500 })
    }

    // 5. Total de Armazéns
    const { count: warehousesCount, error: warehousesError } = await supabase
      .from('wh_warehouse')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)

    if (warehousesError) {
      console.error('Error fetching warehouses count:', warehousesError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: warehousesError.code, message: warehousesError.message } 
      }, { status: 500 })
    }

    // 6. Giro de Estoque (simplificado)
    const { data: movementsData, error: movementsDataError } = await supabase
      .from('wh_inventory_ledger')
      .select('qty_change, movement_type')
      .eq('tenant_id', tenantId)
      .gte('created_at', startDate.toISOString())

    if (movementsDataError) {
      console.error('Error fetching movements data:', movementsDataError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: movementsDataError.code, message: movementsDataError.message } 
      }, { status: 500 })
    }

    const totalOutMovements = movementsData?.reduce((sum, movement) => {
      return movement.movement_type === 'OUT' ? sum + Math.abs(movement.qty_change) : sum
    }, 0) || 0

    const averageInventory = inventoryData?.reduce((sum, item) => sum + item.available_qty, 0) || 0
    const inventoryTurnover = averageInventory > 0 ? (totalOutMovements / averageInventory) : 0

    const kpis = {
      inventory: {
        total_materials: totalMaterialsCount || 0,
        total_value_cents: totalInventoryValueCents,
        total_value_brl: totalInventoryValueCents / 100,
        warehouses_count: warehousesCount || 0
      },
      alerts: {
        active_count: activeAlertsCount || 0
      },
      movements: {
        total_count: movementsCount || 0,
        period: period
      },
      turnover: {
        rate: Math.round(inventoryTurnover * 100) / 100,
        total_out: totalOutMovements,
        average_inventory: Math.round(averageInventory * 100) / 100
      }
    }

    return NextResponse.json({ ok: true, data: kpis })
  } catch (error: any) {
    console.error('Unhandled error in GET /api/wh/kpis:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}
