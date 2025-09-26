import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth/requireSession'
import { Package, AlertTriangle, TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function WHDashboardPage() {
  let inventoryStats = {
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    zeroStockItems: 0,
    blockedItems: 0,
    activeItems: 0
  }
  let recentMovements: any[] = []
  let topCollections: any[] = []

  try {
    const supabase = getSupabaseServerClient()
    await requireSession()

    // Buscar estatísticas de estoque
    const [totalItemsResult, lowStockResult, zeroStockResult, blockedResult, activeResult] = await Promise.allSettled([
      supabase
        .from('wh_inventory_position')
        .select('mm_material', { count: 'exact' })
        ,
      supabase
        .from('wh_inventory_position')
        .select('mm_material', { count: 'exact' })
        
        .eq('calculated_status', 'Em Reposição'),
      supabase
        .from('wh_inventory_position')
        .select('mm_material', { count: 'exact' })
        
        .eq('calculated_status', 'Zerado'),
      supabase
        .from('wh_inventory_position')
        .select('mm_material', { count: 'exact' })
        
        .eq('calculated_status', 'Bloqueado'),
      supabase
        .from('wh_inventory_position')
        .select('mm_material', { count: 'exact' })
        
        .eq('calculated_status', 'Ativo')
    ])

    inventoryStats.totalItems = totalItemsResult.status === 'fulfilled' ? (totalItemsResult.value.count || 0) : 0
    inventoryStats.lowStockItems = lowStockResult.status === 'fulfilled' ? (lowStockResult.value.count || 0) : 0
    inventoryStats.zeroStockItems = zeroStockResult.status === 'fulfilled' ? (zeroStockResult.value.count || 0) : 0
    inventoryStats.blockedItems = blockedResult.status === 'fulfilled' ? (blockedResult.value.count || 0) : 0
    inventoryStats.activeItems = activeResult.status === 'fulfilled' ? (activeResult.value.count || 0) : 0

    // Calcular valor total (simulado)
    inventoryStats.totalValue = inventoryStats.totalItems * 1000 // Simulado

    // Buscar movimentações recentes (simulado por enquanto)
    recentMovements = []

    // Buscar top coleções
    const { data: collectionsData } = await supabase
      .from('wh_inventory_position')
      .select('collection, on_hand_qty')
      
      .not('collection', 'is', null)

    if (collectionsData) {
      const collectionStats = collectionsData.reduce((acc, item) => {
        const collection = item.collection || 'Sem Coleção'
        if (!acc[collection]) {
          acc[collection] = { count: 0, qty: 0 }
        }
        acc[collection].count += 1
        acc[collection].qty += item.on_hand_qty
        return acc
      }, {} as Record<string, { count: number; qty: number }>)

      topCollections = Object.entries(collectionStats)
        .map(([collection, stats]) => ({
          collection,
          count: stats.count,
          qty: stats.qty
        }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5)
    }

  } catch (error) {
    console.error('Error loading WH dashboard data:', error)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'text-fiori-success'
      case 'Em Reposição':
        return 'text-fiori-warning'
      case 'Zerado':
        return 'text-fiori-danger'
      case 'Bloqueado':
        return 'text-fiori-neutral'
      default:
        return 'text-fiori-muted'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fiori-primary">Dashboard de Estoque</h1>
          <p className="text-fiori-secondary mt-2">KPIs e indicadores de performance</p>
        </div>
        <div className="flex gap-3">
          <Link href="/wh" className="btn-fiori-outline">
            Voltar para WH
          </Link>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Total de Itens</p>
                <p className="text-2xl font-bold text-fiori-primary">{inventoryStats.totalItems}</p>
              </div>
              <div className="w-12 h-12 bg-fiori-primary/10 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-fiori-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Valor Total</p>
                <p className="text-2xl font-bold text-fiori-success">
                  R$ {(inventoryStats.totalValue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-12 h-12 bg-fiori-success/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-fiori-success" />
              </div>
            </div>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Em Reposição</p>
                <p className="text-2xl font-bold text-fiori-warning">{inventoryStats.lowStockItems}</p>
              </div>
              <div className="w-12 h-12 bg-fiori-warning/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-fiori-warning" />
              </div>
            </div>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Estoque Zerado</p>
                <p className="text-2xl font-bold text-fiori-danger">{inventoryStats.zeroStockItems}</p>
              </div>
              <div className="w-12 h-12 bg-fiori-danger/10 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-fiori-danger" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status do Estoque */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Distribuição por Status</h3>
          </div>
          <div className="card-fiori-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-fiori-success rounded-full"></div>
                  <span className="text-sm">Ativo</span>
                </div>
                <span className="font-semibold">{inventoryStats.activeItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-fiori-warning rounded-full"></div>
                  <span className="text-sm">Em Reposição</span>
                </div>
                <span className="font-semibold">{inventoryStats.lowStockItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-fiori-danger rounded-full"></div>
                  <span className="text-sm">Zerado</span>
                </div>
                <span className="font-semibold">{inventoryStats.zeroStockItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-fiori-neutral rounded-full"></div>
                  <span className="text-sm">Bloqueado</span>
                </div>
                <span className="font-semibold">{inventoryStats.blockedItems}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Coleções */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Top Coleções</h3>
          </div>
          <div className="card-fiori-content">
            {topCollections.length > 0 ? (
              <div className="space-y-4">
                {topCollections.map((collection, index) => (
                  <div key={collection.collection} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-fiori-primary/10 rounded-full flex items-center justify-center text-xs font-semibold">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium">{collection.collection}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{collection.qty.toLocaleString('pt-BR')}</div>
                      <div className="text-xs text-fiori-muted">{collection.count} itens</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <PieChart className="w-12 h-12 text-fiori-muted mx-auto mb-4" />
                <p className="text-fiori-muted">Nenhuma coleção encontrada</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Movimentações Recentes */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Movimentações Recentes</h3>
          <Link href="/wh/entries" className="btn-fiori-outline text-sm">
            Ver Todas
          </Link>
        </div>
        <div className="card-fiori-content">
          {recentMovements.length > 0 ? (
            <div className="space-y-4">
              {/* Implementar quando houver dados de movimentação */}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-16 h-16 text-fiori-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-fiori-primary mb-2">Nenhuma movimentação recente</h3>
              <p className="text-fiori-muted">As movimentações de estoque aparecerão aqui</p>
            </div>
          )}
        </div>
      </div>

      {/* Alertas e Ações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Alertas de Estoque</h3>
          </div>
          <div className="card-fiori-content">
            {inventoryStats.lowStockItems > 0 || inventoryStats.zeroStockItems > 0 ? (
              <div className="space-y-3">
                {inventoryStats.zeroStockItems > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-fiori-danger/10 border border-fiori-danger/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-fiori-danger" />
                    <div>
                      <p className="font-semibold text-fiori-danger">
                        {inventoryStats.zeroStockItems} item(s) com estoque zerado
                      </p>
                      <p className="text-sm text-fiori-muted">
                        Requer atenção imediata
                      </p>
                    </div>
                  </div>
                )}
                {inventoryStats.lowStockItems > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-fiori-warning/10 border border-fiori-warning/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-fiori-warning" />
                    <div>
                      <p className="font-semibold text-fiori-warning">
                        {inventoryStats.lowStockItems} item(s) com estoque baixo
                      </p>
                      <p className="text-sm text-fiori-muted">
                        Considere reposição
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-fiori-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-6 h-6 text-fiori-success" />
                </div>
                <p className="text-fiori-success font-semibold">Estoque em dia!</p>
                <p className="text-sm text-fiori-muted">Nenhum alerta no momento</p>
              </div>
            )}
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Ações Rápidas</h3>
          </div>
          <div className="card-fiori-content">
            <div className="space-y-3">
              <Link href="/wh/inventory" className="btn-fiori-outline w-full justify-start">
                <Package className="w-4 h-4 mr-2" />
                Ver Posição de Estoque
              </Link>
              <Link href="/wh/entries" className="btn-fiori-outline w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                Entradas de Estoque
              </Link>
              <Link href="/wh/exits" className="btn-fiori-outline w-full justify-start">
                <TrendingDown className="w-4 h-4 mr-2" />
                Saídas de Estoque
              </Link>
              <button className="btn-fiori-outline w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Relatórios de Estoque
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

