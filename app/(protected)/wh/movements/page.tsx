import { supabaseServer } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth/requireSession'
import Link from 'next/link'
import { ArrowUpDown, ArrowUp, ArrowDown, Package, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Movement {
  movement_id: string
  tenant_id: string
  plant_id: string
  mm_material: string
  qty_delta: number
  unit_cost_cents: number
  total_cost_cents: number
  reason: string
  ref_table: string
  ref_id: string
  created_at: string
  created_by: string
  mm_material_data?: {
    mm_comercial: string
    mm_desc: string
  }
}

export default async function MovementsPage({ searchParams }: { searchParams: { material?: string } }) {
  const supabase = supabaseServer()
  await requireSession()

  // Buscar movimentações
  let query = supabase
    .from('wh_inventory_ledger')
    .select(`
      *,
      mm_material_data:mm_material(
        mm_comercial,
        mm_desc
      )
    `)
    
    .order('created_at', { ascending: false })
    .limit(100)

  if (searchParams.material) {
    query = query.eq('mm_material', searchParams.material)
  }

  const { data: movementsData, error } = await query

  if (error) {
    console.error('Error fetching movements:', error)
  }

  const movements: Movement[] = movementsData || []

  // Calcular estatísticas
  const totalMovements = movements.length
  const totalInValue = movements
    .filter(m => m.qty_delta > 0)
    .reduce((total, m) => total + m.total_cost_cents, 0)
  const totalOutValue = movements
    .filter(m => m.qty_delta < 0)
    .reduce((total, m) => total + Math.abs(m.total_cost_cents), 0)

  const getMovementIcon = (reason: string) => {
    switch (reason) {
      case 'PO_RECEIPT':
        return <ArrowDown className="w-4 h-4 text-fiori-success" />
      case 'SO_SHIPMENT':
        return <ArrowUp className="w-4 h-4 text-fiori-danger" />
      case 'ADJUSTMENT':
        return <ArrowUpDown className="w-4 h-4 text-fiori-warning" />
      default:
        return <Package className="w-4 h-4 text-fiori-info" />
    }
  }

  const getMovementLabel = (reason: string) => {
    switch (reason) {
      case 'PO_RECEIPT':
        return 'Recebimento de Compra'
      case 'SO_SHIPMENT':
        return 'Expedição de Venda'
      case 'ADJUSTMENT':
        return 'Ajuste de Estoque'
      case 'TRANSFER_IN':
        return 'Transferência Entrada'
      case 'TRANSFER_OUT':
        return 'Transferência Saída'
      default:
        return reason
    }
  }

  return (
    <div className="container-fiori">
      <div className="section-fiori">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fiori-primary">Movimentações de Estoque</h1>
            <p className="text-fiori-secondary mt-2">Histórico completo de entradas e saídas</p>
          </div>
          <div className="flex gap-4">
            <Link href="/wh" className="btn-fiori-secondary">
              ← Voltar
            </Link>
            <Link href="/wh/inventory" className="btn-fiori-outline">
              Ver Estoque
            </Link>
          </div>
        </div>

        {/* Filtros */}
        {searchParams.material && (
          <div className="card-fiori mb-6">
            <div className="card-fiori-body">
              <div className="flex items-center gap-4">
                <span className="text-fiori-secondary">Filtrando por material:</span>
                <span className="font-mono text-fiori-primary">{searchParams.material}</span>
                <Link href="/wh/movements" className="btn-fiori-outline text-xs">
                  Limpar Filtro
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Estatísticas */}
        <div className="grid-fiori-3 mb-8">
          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Total de Movimentações</p>
                <p className="tile-fiori-metric">{totalMovements}</p>
              </div>
              <ArrowUpDown className="tile-fiori-icon" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Valor Entradas</p>
                <p className="tile-fiori-metric text-fiori-success">
                  R$ {(totalInValue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <ArrowDown className="tile-fiori-icon text-fiori-success" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Valor Saídas</p>
                <p className="tile-fiori-metric text-fiori-danger">
                  R$ {(totalOutValue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <ArrowUp className="tile-fiori-icon text-fiori-danger" />
            </div>
          </div>
        </div>

        {/* Tabela de Movimentações */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h2 className="card-fiori-title">Histórico de Movimentações</h2>
          </div>
          <div className="card-fiori-body">
            <div className="overflow-x-auto">
              <table className="table-fiori">
                <thead>
                  <tr>
                    <th>Data/Hora</th>
                    <th>Material</th>
                    <th>Tipo</th>
                    <th className="text-right">Quantidade</th>
                    <th className="text-right">Custo Unit.</th>
                    <th className="text-right">Valor Total</th>
                    <th>Referência</th>
                    <th>Usuário</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((movement) => (
                    <tr key={movement.movement_id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-fiori-muted" />
                          <div>
                            <div className="text-sm font-medium">
                              {new Date(movement.created_at).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="text-xs text-fiori-muted">
                              {new Date(movement.created_at).toLocaleTimeString('pt-BR')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-mono text-sm text-fiori-primary">
                            {movement.mm_material}
                          </div>
                          <div className="text-xs text-fiori-muted">
                            {movement.mm_material_data?.mm_comercial || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          {getMovementIcon(movement.reason)}
                          <span className="text-sm">
                            {getMovementLabel(movement.reason)}
                          </span>
                        </div>
                      </td>
                      <td className="text-right">
                        <span className={`font-medium ${
                          movement.qty_delta > 0 ? 'text-fiori-success' : 'text-fiori-danger'
                        }`}>
                          {movement.qty_delta > 0 ? '+' : ''}{movement.qty_delta.toLocaleString()}
                        </span>
                      </td>
                      <td className="text-right">
                        R$ {(movement.unit_cost_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="text-right font-medium">
                        R$ {(movement.total_cost_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <div className="text-sm">
                          <div className="font-mono text-xs text-fiori-muted">
                            {movement.ref_table}
                          </div>
                          <div className="text-fiori-primary">
                            {movement.ref_id}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-sm text-fiori-muted">
                          {movement.created_by || 'Sistema'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {movements.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-fiori-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-fiori-muted mb-2">
                  Nenhuma movimentação encontrada
                </h3>
                <p className="text-fiori-muted">
                  As movimentações aparecerão aqui conforme os pedidos forem processados.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

