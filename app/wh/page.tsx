import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function WHPage() {
  let inventoryItems: any[] = []
  let totalItems = 0
  let totalValue = 0
  let lowStockItems = 0
  let zeroStockItems = 0

  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    // Buscar dados para KPIs
    const [inventoryResult, totalItemsResult, lowStockResult, zeroStockResult] = await Promise.allSettled([
      supabase
        .from('wh_inventory_position')
        .select(`
          mm_material,
          mm_comercial,
          collection,
          on_hand_qty,
          available_qty,
          status,
          calculated_status,
          warehouse_name
        `)
        .eq('tenant_id', tenantId)
        .order('mm_comercial')
        .limit(10),
      supabase
        .from('wh_inventory_position')
        .select('mm_material', { count: 'exact' })
        .eq('tenant_id', tenantId),
      supabase
        .from('wh_inventory_position')
        .select('mm_material', { count: 'exact' })
        .eq('tenant_id', tenantId)
        .eq('calculated_status', 'Em Reposição'),
      supabase
        .from('wh_inventory_position')
        .select('mm_material', { count: 'exact' })
        .eq('tenant_id', tenantId)
        .eq('calculated_status', 'Zerado')
    ])

    inventoryItems = inventoryResult.status === 'fulfilled' ? (inventoryResult.value.data || []) : []
    totalItems = totalItemsResult.status === 'fulfilled' ? (totalItemsResult.value.count || 0) : 0
    lowStockItems = lowStockResult.status === 'fulfilled' ? (lowStockResult.value.count || 0) : 0
    zeroStockItems = zeroStockResult.status === 'fulfilled' ? (zeroStockResult.value.count || 0) : 0

    // Calcular valor total do estoque (simulado - seria necessário buscar preços)
    totalValue = inventoryItems.reduce((sum, item) => sum + (item.on_hand_qty * 100), 0) // Simulado

  } catch (error) {
    console.error('Error loading WH data:', error)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ativo':
        return <span className="badge-fiori badge-fiori-success">Ativo</span>
      case 'Em Reposição':
        return <span className="badge-fiori badge-fiori-warning">Em Reposição</span>
      case 'Zerado':
        return <span className="badge-fiori badge-fiori-danger">Zerado</span>
      case 'Bloqueado':
        return <span className="badge-fiori badge-fiori-neutral">Bloqueado</span>
      default:
        return <span className="badge-fiori badge-fiori-neutral">{status}</span>
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="btn-fiori-outline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">WH - Gestão de Estoque</h1>
          <p className="text-xl text-fiori-secondary mb-2">Central de estoque e movimentações</p>
          <p className="text-lg text-fiori-muted">Gerencie inventário e movimentações de materiais</p>
        </div>
        <div className="w-20"></div> {/* Spacer para centralizar */}
      </div>

      {/* Tiles Principais */}
      <div className="grid-fiori-4">
        <Link href="/wh/inventory" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Central de Estoque</h3>
            <p className="tile-fiori-subtitle">Posição de estoque</p>
          </div>
        </Link>

        <Link href="/wh/entries" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Entradas de Estoque</h3>
            <p className="tile-fiori-subtitle">Movimentações de entrada</p>
          </div>
        </Link>

        <Link href="/wh/exits" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Saídas de Estoque</h3>
            <p className="tile-fiori-subtitle">Movimentações de saída</p>
          </div>
        </Link>

        <Link href="/wh/dashboard" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Dashboard de Estoque</h3>
            <p className="tile-fiori-subtitle">KPIs e relatórios</p>
          </div>
        </Link>
      </div>

      {/* KPIs Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-fiori-primary mb-6">Visão Geral</h2>
        <div className="grid-fiori-6">
          {/* KPI 1 - Total de Itens */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Total de Itens</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-success">{totalItems}</div>
            <p className="tile-fiori-metric-label">Itens em estoque</p>
          </div>

          {/* KPI 2 - Valor Total */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Valor Total</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-success">
              R$ {(totalValue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="tile-fiori-metric-label">Valor total do estoque</p>
          </div>

          {/* KPI 3 - Itens em Reposição */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Em Reposição</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-warning">{lowStockItems}</div>
            <p className="tile-fiori-metric-label">Itens com estoque baixo</p>
          </div>

          {/* KPI 4 - Itens Zerados */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Estoque Zerado</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-danger">{zeroStockItems}</div>
            <p className="tile-fiori-metric-label">Itens sem estoque</p>
          </div>

          {/* KPI 5 - Giro de Estoque */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Giro de Estoque</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-neutral">2.4x</div>
            <p className="tile-fiori-metric-label">Rotação anual</p>
          </div>

          {/* KPI 6 - Eficiência */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Eficiência</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-success">94.2%</div>
            <p className="tile-fiori-metric-label">Precisão do estoque</p>
          </div>
        </div>
      </div>

      {/* Itens de Estoque Recentes */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-fiori-primary mb-6">Posição de Estoque</h2>
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Itens em Estoque</h3>
            <Link href="/wh/inventory" className="btn-fiori-outline text-sm">
              Ver Todos
            </Link>
          </div>
          <div className="card-fiori-content">
            {inventoryItems.length > 0 ? (
              <div className="space-y-4">
                {inventoryItems.map((item) => (
                  <div key={item.mm_material} className="flex items-center justify-between p-4 border border-fiori-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-fiori-primary/10 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-fiori-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-fiori-primary">
                          {item.mm_comercial || item.mm_material}
                        </h4>
                        <p className="text-sm text-fiori-secondary">
                          {item.collection && `${item.collection} • `}
                          {item.warehouse_name}
                        </p>
                        <p className="text-xs text-fiori-muted">
                          Disponível: {item.available_qty} • Total: {item.on_hand_qty}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="mb-2">
                        {getStatusBadge(item.calculated_status)}
                      </div>
                      <Link 
                        href={`/wh/inventory/${item.mm_material}`}
                        className="btn-fiori-outline text-xs"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-fiori-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-fiori-muted">Nenhum item em estoque encontrado</p>
                <p className="text-sm text-fiori-muted mt-1">
                  Os itens aparecerão aqui quando houver movimentações de estoque
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
