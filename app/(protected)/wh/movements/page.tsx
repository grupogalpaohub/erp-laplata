import { supabaseServer } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth/requireSession'
import Link from 'next/link'
import { ArrowUpDown, ArrowUp, ArrowDown, Package, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Movement {
  ledger_id: string
  tenant_id: string
  plant_id: string
  mm_material: string
  movement: string
  qty: number
  ref_type: string
  ref_id: string
  created_at: string
  mm_material_data?: {
    mm_comercial: string
    mm_desc: string
  }
}

export default async function MovementsPage({ searchParams }: { searchParams: { material?: string } }) {
  const supabase = supabaseServer()
  await requireSession()

  // ✅ CORREÇÃO: Usar nomes reais das colunas do schema
  let query = supabase
    .from('wh_inventory_ledger')
    .select(`
      ledger_id,
      tenant_id,
      plant_id,
      mm_material,
      movement,
      qty,
      ref_type,
      ref_id,
      created_at,
      mm_material_data:mm_material(
        mm_comercial,
        mm_desc
      )
    `)
    
    .order('created_at', { ascending: false })
    .limit(200)

  if (searchParams.material) {
    query = query.eq('mm_material', searchParams.material)
  }

  const { data: movementsData, error } = await query

  if (error) {
    console.error('Error fetching movements:', error)
  }

  const movements: Movement[] = movementsData || []

  // ✅ CORREÇÃO: Calcular estatísticas com nomes reais das colunas
  const totalMovements = movements.length
  const totalInMovements = movements.filter(m => m.movement === 'IN').length
  const totalOutMovements = movements.filter(m => m.movement === 'OUT').length

  // ✅ CORREÇÃO: Usar campo 'movement' em vez de 'reason'
  const getMovementIcon = (movement: string) => {
    switch (movement) {
      case 'IN':
        return <ArrowDown className="w-4 h-4 text-fiori-success" />
      case 'OUT':
        return <ArrowUp className="w-4 h-4 text-fiori-danger" />
      case 'ADJUST':
        return <ArrowUpDown className="w-4 h-4 text-fiori-warning" />
      case 'RESERVE':
        return <Package className="w-4 h-4 text-fiori-info" />
      case 'RELEASE':
        return <Package className="w-4 h-4 text-fiori-info" />
      default:
        return <Package className="w-4 h-4 text-fiori-info" />
    }
  }

  const getMovementLabel = (movement: string) => {
    switch (movement) {
      case 'IN':
        return 'Entrada'
      case 'OUT':
        return 'Saída'
      case 'ADJUST':
        return 'Ajuste'
      case 'RESERVE':
        return 'Reserva'
      case 'RELEASE':
        return 'Liberação'
      default:
        return movement
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
                <p className="tile-fiori-subtitle">Entradas</p>
                <p className="tile-fiori-metric text-fiori-success">
                  {totalInMovements}
                </p>
              </div>
              <ArrowDown className="tile-fiori-icon text-fiori-success" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Saídas</p>
                <p className="tile-fiori-metric text-fiori-danger">
                  {totalOutMovements}
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
                    <th>Referência</th>
                    <th>Usuário</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((movement) => (
                    <tr key={movement.ledger_id}>
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
                          {getMovementIcon(movement.movement)}
                          <span className="text-sm">
                            {getMovementLabel(movement.movement)}
                          </span>
                        </div>
                      </td>
                      <td className="text-right">
                        <span className={`font-medium ${
                          movement.movement === 'IN' ? 'text-fiori-success' : 'text-fiori-danger'
                        }`}>
                          {movement.movement === 'IN' ? '+' : ''}{movement.qty.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div className="font-mono text-xs text-fiori-muted">
                            {movement.ref_type}
                          </div>
                          <div className="text-fiori-primary">
                            {movement.ref_id}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-sm text-fiori-muted">
                          Sistema
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

