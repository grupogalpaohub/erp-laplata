import Link from 'next/link'
import { supabaseServer } from '@/src/lib/supabaseServer'
import { getTenantId } from '@/src/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  let materials = []
  let vendors = []
  let orders = []
  let sales = []
  let inventory = []
  let totalMaterials = 0
  let totalVendors = 0
  let totalOrders = 0
  let totalSalesValue = 0
  let totalInventoryValue = 0
  let totalProfit = 0

  try {
    const supabase = supabaseServer()
    const tenantId = await getTenantId()

    // Buscar dados para KPIs com tratamento de erro
    const [materialsResult, vendorsResult, ordersResult, salesResult, inventoryResult] = await Promise.allSettled([
      supabase
        .from('mm_material')
        .select('mm_material, mm_comercial, purchase_price_cents, sale_price_cents')
        .eq('tenant_id', tenantId),
      supabase
        .from('mm_vendor')
        .select('vendor_id, vendor_name')
        .eq('tenant_id', tenantId),
      supabase
        .from('mm_purchase_order')
        .select('mm_order, vendor_id, total_amount_cents, status')
        .eq('tenant_id', tenantId),
      supabase
        .from('sd_sales_order')
        .select('so_id, total_final_cents, order_date')
        .eq('tenant_id', tenantId)
        .gte('order_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]),
      supabase
        .from('wh_inventory_balance')
        .select('material_id, qty_on_hand, unit_cost_cents')
        .eq('tenant_id', tenantId)
        .gt('qty_on_hand', 0)
    ])

    materials = materialsResult.status === 'fulfilled' ? (materialsResult.value.data || []) : []
    vendors = vendorsResult.status === 'fulfilled' ? (vendorsResult.value.data || []) : []
    orders = ordersResult.status === 'fulfilled' ? (ordersResult.value.data || []) : []
    sales = salesResult.status === 'fulfilled' ? (salesResult.value.data || []) : []
    inventory = inventoryResult.status === 'fulfilled' ? (inventoryResult.value.data || []) : []

  } catch (error) {
    console.error('Error loading dashboard data:', error)
    // Continuar com arrays vazios em caso de erro
  }

  // Calcular KPIs
  totalMaterials = materials.length
  totalVendors = vendors.length
  totalOrders = orders.length
  totalSalesValue = sales.reduce((sum, order) => sum + (order.total_final_cents || 0), 0)
  totalInventoryValue = inventory.reduce((sum, item) => sum + (item.qty_on_hand * item.unit_cost_cents || 0), 0)
  totalProfit = totalSalesValue - totalInventoryValue

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">ERP LaPlata</h1>
        <p className="text-xl text-fiori-secondary mb-2">Sistema de Gestão Empresarial</p>
        <p className="text-lg text-fiori-muted">Selecione um módulo para começar</p>
      </div>

      {/* Módulos */}
      <div className="grid-fiori-4">
        <Link href="/mm" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Materiais (MM)</h3>
            <p className="tile-fiori-subtitle">Materiais, compras, fornecedores</p>
          </div>
        </Link>

        <Link href="/sd" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Vendas (SD)</h3>
            <p className="tile-fiori-subtitle">Pedidos, clientes, faturas</p>
          </div>
        </Link>

        <Link href="/wh" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Estoque (WH)</h3>
            <p className="tile-fiori-subtitle">Inventário e movimentações</p>
          </div>
        </Link>

        <Link href="/co" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Controle (CO)</h3>
            <p className="tile-fiori-subtitle">Relatórios e custos</p>
          </div>
        </Link>

        <Link href="/crm" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">CRM</h3>
            <p className="tile-fiori-subtitle">Clientes e oportunidades</p>
          </div>
        </Link>

        <Link href="/fi" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Financeiro</h3>
            <p className="tile-fiori-subtitle">Contas a pagar e receber</p>
          </div>
        </Link>

        <Link href="/analytics" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Analytics</h3>
            <p className="tile-fiori-subtitle">Relatórios e dashboards</p>
          </div>
        </Link>

        <Link href="/setup" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Configurações</h3>
            <p className="tile-fiori-subtitle">Setup e customização</p>
          </div>
        </Link>
      </div>

      {/* KPIs Section - EXATAMENTE como SAP Fiori */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-fiori-primary mb-6">Visão Geral</h2>
        <div className="grid-fiori-6">
          {/* KPI 1 - Total de Materiais (Verde - Bom) */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Total de Materiais</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-success">{totalMaterials}</div>
            <p className="tile-fiori-metric-label">Itens cadastrados</p>
          </div>

          {/* KPI 2 - Fornecedores (Verde - Bom) */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Fornecedores</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-success">{totalVendors}</div>
            <p className="tile-fiori-metric-label">Fornecedores ativos</p>
          </div>

          {/* KPI 3 - Pedidos de Compra (Neutro) */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Valor Total em Estoque</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-success">R$ {(totalInventoryValue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="tile-fiori-metric-label">Valor do inventário</p>
          </div>

          {/* KPI 4 - Materiais sem Fornecedor (Vermelho - Ruim) */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Vendas do Mês</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-success">R$ {(totalSalesValue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="tile-fiori-metric-label">Receita do período</p>
          </div>

          {/* KPI 5 - Variação de Preços (Amarelo - Atenção) */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Lucro Total</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-success">R$ {(totalProfit / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="tile-fiori-metric-label">Margem de lucro</p>
          </div>

        </div>
      </div>
    </div>
  )
}