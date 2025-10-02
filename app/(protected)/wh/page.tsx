import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireSession } from '@/lib/auth/requireSession'
import { supabaseServer } from '@/lib/supabase/server'
import { formatBRL } from '@/lib/money'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

async function loadWhKpis() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/wh/kpis`, { cache: 'no-store' })
  const json = await res.json()
  if (!json?.ok) throw new Error(json?.error?.message ?? 'erro kpis')
  return json.data as { total_items: number; low_stock: number; today_moves: number; total_value_cents: number }
}

export default async function WHPage() {
  let inventory: any[] = []
  let movements: any[] = []
  let transfers: any[] = []
  let totalItems = 0
  let totalValue = 0
  let lowStockItems = 0
  let movementsToday = 0

  try {
    await requireSession() // Verificar se está autenticado
    
    // Carregar KPIs via API
    const kpis = await loadWhKpis()
    totalItems = kpis.total_items
    totalValue = kpis.total_value_cents
    lowStockItems = kpis.low_stock
    movementsToday = kpis.today_moves

    const supabase = supabaseServer()

    // Buscar dados para listagens usando RLS (não precisa especificar tenant_id)
    const [inventoryResult, movementsResult, transfersResult] = await Promise.allSettled([
      supabase
        .from('wh_inventory_balance')
        .select('mm_material, on_hand_qty, reserved_qty, status'),
      supabase
        .from('wh_inventory_ledger')
        .select('movement_id, type, quantity, created_at')
        .gte('created_at', new Date().toISOString().split('T')[0]),
      supabase
        .from('wh_transfer')
        .select('transfer_id, status, created_at')
    ])

    inventory = inventoryResult.status === 'fulfilled' ? (inventoryResult.value.data || []) : []
    movements = movementsResult.status === 'fulfilled' ? (movementsResult.value.data || []) : []
    transfers = transfersResult.status === 'fulfilled' ? (transfersResult.value.data || []) : []

  } catch (error) {
    console.error('Error loading WH data:', error)
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
          <p className="text-xl text-fiori-secondary mb-2">Inventário e movimentações</p>
          <p className="text-lg text-fiori-muted">Controle de estoque e movimentações de materiais</p>
        </div>
        <div className="w-20"></div> {/* Spacer para centralizar */}
      </div>

      {/* Tiles Principais */}
      <div className="grid-fiori-3">
        <Link href="/wh/inventory" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Inventário</h3>
            <p className="tile-fiori-subtitle">Controle de estoque</p>
          </div>
        </Link>

        <Link href="/wh/movements" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Movimentações</h3>
            <p className="tile-fiori-subtitle">Entradas e saídas</p>
          </div>
        </Link>

        <Link href="/wh/transfers" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Transferências</h3>
            <p className="tile-fiori-subtitle">Entre locais</p>
          </div>
        </Link>
      </div>

      {/* Visão Geral - KPIs */}
      <div className="grid-fiori-4">
        <div className="card-fiori">
          <div className="card-fiori-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-fiori-secondary">Total de Itens</h3>
              <svg className="w-5 h-5 text-fiori-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="kpi-fiori kpi-fiori-primary">{totalItems}</p>
              <p className="text-sm text-fiori-muted">Itens em estoque</p>
            </div>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-fiori-secondary">Valor Total</h3>
              <svg className="w-5 h-5 text-fiori-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="kpi-fiori kpi-fiori-success">{formatBRL(totalValue)}</p>
              <p className="text-sm text-fiori-muted">Valor do inventário</p>
            </div>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-fiori-secondary">Baixo Estoque</h3>
              <svg className="w-5 h-5 text-fiori-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="kpi-fiori kpi-fiori-danger">{lowStockItems}</p>
              <p className="text-sm text-fiori-muted">Itens críticos</p>
            </div>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-fiori-secondary">Movimentações Hoje</h3>
              <svg className="w-5 h-5 text-fiori-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="kpi-fiori kpi-fiori-warning">{movementsToday}</p>
              <p className="text-sm text-fiori-muted">Movimentações do dia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seções de Listagem */}
      <div className="grid-fiori-2">
        <div className="card-fiori">
          <div className="card-fiori-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-fiori-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h2 className="card-fiori-title">Itens em Baixo Estoque</h2>
              </div>
              <Link href="/wh/inventory?filter=low-stock" className="text-fiori-primary hover:text-fiori-accent-blue text-sm font-medium transition-colors">
                Ver Todos
              </Link>
            </div>
          </div>
          <div className="card-fiori-body">
            {inventory.filter(item => (item.on_hand_qty || 0) < 10).length > 0 ? (
              <div className="space-y-3">
                {inventory.filter(item => (item.on_hand_qty || 0) < 10).slice(0, 5).map((item) => (
                  <div key={item.mm_material} className="flex items-center justify-between p-3 bg-fiori-secondary rounded">
                    <div>
                      <p className="text-fiori-primary font-medium">{item.mm_material}</p>
                      <p className="text-fiori-secondary text-sm">Qtd: {item.on_hand_qty || 0}</p>
                    </div>
                    <span className="text-fiori-danger text-sm font-medium">Crítico</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-fiori-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="text-lg font-medium text-fiori-secondary mb-2">Estoque em dia</h3>
                <p className="text-fiori-muted mb-4">Todos os itens estão com estoque adequado</p>
                <Link 
                  href="/wh/inventory"
                  className="btn-fiori-primary"
                >
                  Ver Inventário
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-fiori-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h2 className="card-fiori-title">Movimentações Recentes</h2>
              </div>
              <Link href="/wh/movements" className="text-fiori-primary hover:text-fiori-accent-blue text-sm font-medium transition-colors">
                Ver Todas
              </Link>
            </div>
          </div>
          <div className="card-fiori-body">
            {movements.length > 0 ? (
              <div className="space-y-3">
                {movements.slice(0, 5).map((movement) => (
                  <div key={movement.movement_id} className="flex items-center justify-between p-3 bg-fiori-secondary rounded">
                    <div>
                      <p className="text-fiori-primary font-medium capitalize">{movement.type}</p>
                      <p className="text-fiori-secondary text-sm">Qtd: {movement.quantity}</p>
                    </div>
                    <span className="text-fiori-primary text-sm">
                      {new Date(movement.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-fiori-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h3 className="text-lg font-medium text-fiori-secondary mb-2">Nenhuma movimentação</h3>
                <p className="text-fiori-muted mb-4">Não há movimentações registradas hoje</p>
                <Link 
                  href="/wh/movements"
                  className="btn-fiori-primary"
                >
                  Ver Histórico
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
