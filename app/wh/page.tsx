import Link from 'next/link'
import { ArrowLeft, Package, TrendingUp, AlertTriangle, BarChart3, Warehouse, ArrowRightLeft, Calculator } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'
import { formatBRL } from '@/lib/money'
import TileCard from '@/components/ui/TileCard'
import KpiCard from '@/components/ui/KpiCard'
import ListSection from '@/components/ui/ListSection'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function WHPage() {
  let inventory: any[] = []
  let movements: any[] = []
  let transfers: any[] = []
  let totalItems = 0
  let totalValue = 0
  let lowStockItems = 0
  let movementsToday = 0

  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    // Buscar dados para KPIs
    const [inventoryResult, movementsResult, transfersResult, lowStockResult] = await Promise.allSettled([
      supabase
        .from('wh_inventory_balance')
        .select('mm_material, quantity, unit_cost_cents')
        .eq('tenant_id', tenantId),
      supabase
        .from('wh_inventory_ledger')
        .select('movement_id, movement_type, quantity, created_at')
        .eq('tenant_id', tenantId)
        .gte('created_at', new Date().toISOString().split('T')[0]),
      supabase
        .from('wh_transfer')
        .select('transfer_id, status, created_at')
        .eq('tenant_id', tenantId),
      supabase
        .from('wh_inventory_balance')
        .select('mm_material, quantity')
        .eq('tenant_id', tenantId)
        .lt('quantity', 10)
    ])

    inventory = inventoryResult.status === 'fulfilled' ? (inventoryResult.value.data || []) : []
    movements = movementsResult.status === 'fulfilled' ? (movementsResult.value.data || []) : []
    transfers = transfersResult.status === 'fulfilled' ? (transfersResult.value.data || []) : []
    const lowStock = lowStockResult.status === 'fulfilled' ? (lowStockResult.value.data || []) : []

    // Calcular KPIs
    totalItems = inventory.length
    totalValue = inventory.reduce((sum, item) => sum + (item.quantity * (item.unit_cost_cents || 0)), 0)
    lowStockItems = lowStock.length
    movementsToday = movements.length

  } catch (error) {
    console.error('Error loading WH data:', error)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link 
                href="/" 
                className="inline-flex items-center text-gray-300 hover:text-white transition-colors mr-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
              <h1 className="text-xl font-semibold text-white">WH - Gestão de Estoque</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">WH - Gestão de Estoque</h1>
          <p className="text-xl text-gray-300 mb-2">Inventário e movimentações</p>
          <p className="text-lg text-gray-400">Controle de estoque e movimentações de materiais</p>
        </div>

        {/* Tiles Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <TileCard
            title="Inventário"
            subtitle="Controle de estoque"
            icon={Package}
            href="/wh/inventory"
            color="blue"
          />
          
          <TileCard
            title="Movimentações"
            subtitle="Entradas e saídas"
            icon={TrendingUp}
            href="/wh/movements"
            color="green"
          />
          
          <TileCard
            title="Transferências"
            subtitle="Entre locais"
            icon={ArrowRightLeft}
            href="/wh/transfers"
            color="purple"
          />
        </div>

        {/* Visão Geral - KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <KpiCard
            title="Total de Itens"
            value={totalItems}
            subtitle="Itens em estoque"
            icon={Package}
            color="blue"
          />
          
          <KpiCard
            title="Valor Total"
            value={formatBRL(totalValue)}
            subtitle="Valor do inventário"
            icon={BarChart3}
            color="green"
          />
          
          <KpiCard
            title="Baixo Estoque"
            value={lowStockItems}
            subtitle="Itens críticos"
            icon={AlertTriangle}
            color="red"
          />
          
          <KpiCard
            title="Movimentações Hoje"
            value={movementsToday}
            subtitle="Movimentações do dia"
            icon={TrendingUp}
            color="orange"
          />
        </div>

        {/* Seções de Listagem */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ListSection
            title="Itens em Baixo Estoque"
            viewAllHref="/wh/inventory?filter=low-stock"
            viewAllText="Ver Todos"
            icon={AlertTriangle}
            emptyState={{
              icon: Package,
              title: "Estoque em dia",
              description: "Todos os itens estão com estoque adequado",
              actionText: "Ver Inventário",
              actionHref: "/wh/inventory"
            }}
          >
            {inventory.filter(item => item.quantity < 10).length > 0 ? (
              <div className="space-y-3">
                {inventory.filter(item => item.quantity < 10).slice(0, 5).map((item) => (
                  <div key={item.mm_material} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{item.mm_material}</p>
                      <p className="text-gray-400 text-sm">Qtd: {item.quantity}</p>
                    </div>
                    <span className="text-red-400 text-sm font-medium">Crítico</span>
                  </div>
                ))}
              </div>
            ) : null}
          </ListSection>

          <ListSection
            title="Movimentações Recentes"
            viewAllHref="/wh/movements"
            viewAllText="Ver Todas"
            icon={TrendingUp}
            emptyState={{
              icon: TrendingUp,
              title: "Nenhuma movimentação",
              description: "Não há movimentações registradas hoje",
              actionText: "Ver Histórico",
              actionHref: "/wh/movements"
            }}
          >
            {movements.length > 0 ? (
              <div className="space-y-3">
                {movements.slice(0, 5).map((movement) => (
                  <div key={movement.movement_id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium capitalize">{movement.movement_type}</p>
                      <p className="text-gray-400 text-sm">Qtd: {movement.quantity}</p>
                    </div>
                    <span className="text-blue-400 text-sm">
                      {new Date(movement.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </ListSection>
        </div>
      </div>
    </div>
  )
}