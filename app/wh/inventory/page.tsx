import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'
import Link from 'next/link'
import { Package, Eye, TrendingUp, AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface InventoryItem {
  tenant_id: string
  plant_id: string
  mm_material: string
  on_hand_qty: number
  reserved_qty: number
  available_qty: number
  mm_material_data?: {
    mm_comercial: string
    mm_desc: string
    mm_price_cents: number
  }
}

export default async function InventoryPage() {
  const supabase = createSupabaseServerClient()
  const tenantId = await getTenantId()

  // Buscar posição de estoque
  const { data: inventoryData, error } = await supabase
    .from('v_wh_stock')
    .select(`
      *,
      mm_material_data:mm_material(
        mm_comercial,
        mm_desc,
        mm_price_cents
      )
    `)
    .eq('tenant_id', tenantId)
    .order('mm_material')

  if (error) {
    console.error('Error fetching inventory:', error)
  }

  const inventory: InventoryItem[] = inventoryData || []

  // Calcular estatísticas
  const totalValue = inventory.reduce((total, item) => {
    const price = item.mm_material_data?.mm_price_cents || 0
    return total + (item.on_hand_qty * price)
  }, 0)

  const lowStockItems = inventory.filter(item => item.on_hand_qty < 10).length
  const zeroStockItems = inventory.filter(item => item.on_hand_qty === 0).length

  return (
    <div className="container-fiori">
      <div className="section-fiori">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fiori-primary">Posição de Estoque</h1>
            <p className="text-fiori-secondary mt-2">Visão completa do inventário por material</p>
          </div>
          <div className="flex gap-4">
            <Link href="/wh" className="btn-fiori-secondary">
              ← Voltar
            </Link>
            <Link href="/wh/movements" className="btn-fiori-primary">
              Ver Movimentações
            </Link>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid-fiori-4 mb-8">
          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Valor Total</p>
                <p className="tile-fiori-metric">
                  R$ {(totalValue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Package className="tile-fiori-icon" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Total de Itens</p>
                <p className="tile-fiori-metric">{inventory.length}</p>
              </div>
              <TrendingUp className="tile-fiori-icon" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Estoque Baixo</p>
                <p className="tile-fiori-metric text-fiori-warning">{lowStockItems}</p>
              </div>
              <AlertTriangle className="tile-fiori-icon text-fiori-warning" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Sem Estoque</p>
                <p className="tile-fiori-metric text-fiori-danger">{zeroStockItems}</p>
              </div>
              <AlertTriangle className="tile-fiori-icon text-fiori-danger" />
            </div>
          </div>
        </div>

        {/* Tabela de Estoque */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h2 className="card-fiori-title">Posição por Material</h2>
          </div>
          <div className="card-fiori-body">
            <div className="overflow-x-auto">
              <table className="table-fiori">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Descrição</th>
                    <th className="text-right">Em Mão</th>
                    <th className="text-right">Reservado</th>
                    <th className="text-right">Disponível</th>
                    <th className="text-right">Valor Unit.</th>
                    <th className="text-right">Valor Total</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => {
                    const unitPrice = item.mm_material_data?.mm_price_cents || 0
                    const totalValue = item.on_hand_qty * unitPrice
                    const isLowStock = item.on_hand_qty < 10
                    const isZeroStock = item.on_hand_qty === 0

                    return (
                      <tr key={`${item.plant_id}-${item.mm_material}`}>
                        <td>
                          <span className="font-mono text-sm text-fiori-primary">
                            {item.mm_material}
                          </span>
                        </td>
                        <td>
                          <div>
                            <div className="font-semibold">
                              {item.mm_material_data?.mm_comercial || 'N/A'}
                            </div>
                            <div className="text-xs text-fiori-muted">
                              {item.mm_material_data?.mm_desc || 'Sem descrição'}
                            </div>
                          </div>
                        </td>
                        <td className="text-right font-medium">
                          {item.on_hand_qty.toLocaleString()}
                        </td>
                        <td className="text-right">
                          <span className="text-fiori-info">
                            {item.reserved_qty.toLocaleString()}
                          </span>
                        </td>
                        <td className="text-right font-medium">
                          <span className={item.available_qty > 0 ? 'text-fiori-success' : 'text-fiori-danger'}>
                            {item.available_qty.toLocaleString()}
                          </span>
                        </td>
                        <td className="text-right">
                          R$ {(unitPrice / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="text-right font-medium">
                          R$ {(totalValue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td>
                          {isZeroStock ? (
                            <span className="badge-fiori badge-fiori-danger">Sem Estoque</span>
                          ) : isLowStock ? (
                            <span className="badge-fiori badge-fiori-warning">Estoque Baixo</span>
                          ) : (
                            <span className="badge-fiori badge-fiori-success">Normal</span>
                          )}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <Link
                              href={`/wh/movements?material=${item.mm_material}`}
                              className="btn-fiori-outline text-xs"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
