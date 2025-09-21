import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { KpiData } from '@/types'

export function useKpiData() {
  const [data, setData] = useState<KpiData>({
    totalMaterials: 0,
    totalVendors: 0,
    totalOrders: 0,
    totalValue: 0,
    totalSales: 0,
    totalInventory: 0,
    totalProfit: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchKpiData() {
      try {
        setLoading(true)
        setError(null)
        
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const tenantId = 'LaplataLunaria' // Hardcoded para cliente

        // Buscar dados em paralelo
        const [materialsResult, vendorsResult, ordersResult, salesResult, inventoryResult] = await Promise.allSettled([
          supabase
            .from('mm_material')
            .select('mm_material, purchase_price_cents, sale_price_cents')
            .eq('tenant_id', tenantId),
          supabase
            .from('mm_vendor')
            .select('vendor_id, is_active')
            .eq('tenant_id', tenantId),
          supabase
            .from('mm_purchase_order')
            .select('total_amount_cents, status')
            .eq('tenant_id', tenantId),
          supabase
            .from('sd_sales_order')
            .select('total_final_cents, order_date')
            .eq('tenant_id', tenantId)
            .gte('order_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]),
          supabase
            .from('wh_inventory_balance')
            .select('qty_on_hand, unit_cost_cents')
            .eq('tenant_id', tenantId)
            .gt('qty_on_hand', 0)
        ])

        // Processar resultados
        const materials = materialsResult.status === 'fulfilled' ? (materialsResult.value.data || []) : []
        const vendors = vendorsResult.status === 'fulfilled' ? (vendorsResult.value.data || []) : []
        const orders = ordersResult.status === 'fulfilled' ? (ordersResult.value.data || []) : []
        const sales = salesResult.status === 'fulfilled' ? (salesResult.value.data || []) : []
        const inventory = inventoryResult.status === 'fulfilled' ? (inventoryResult.value.data || []) : []

        // Calcular KPIs
        const totalMaterials = materials.length
        const totalVendors = vendors.filter(v => v.is_active).length
        const totalOrders = orders.length
        const totalValue = orders.reduce((sum, order) => sum + (order.total_amount_cents || 0), 0)
        const totalSales = sales.reduce((sum, sale) => sum + (sale.total_final_cents || 0), 0)
        const totalInventory = inventory.reduce((sum, item) => sum + (item.qty_on_hand * (item.unit_cost_cents || 0)), 0)
        const totalProfit = totalSales - totalValue

        setData({
          totalMaterials,
          totalVendors,
          totalOrders,
          totalValue,
          totalSales,
          totalInventory,
          totalProfit
        })
      } catch (err) {
        console.error('Error fetching KPI data:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    fetchKpiData()
  }, [])

  const refetch = () => {
    fetchKpiData()
  }

  return { data, loading, error, refetch }
}
