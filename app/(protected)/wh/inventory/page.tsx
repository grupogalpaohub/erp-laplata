import { supabaseServer } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth/requireSession'
import { formatBRL } from '@/lib/money'
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
    mm_purchase_price_cents: number
  }
}

export default async function InventoryPage() {
  const sb = supabaseServer()
  await requireSession()

  // ✅ CORREÇÃO: 2 chamadas separadas + join em memória
  // 1) Buscar inventário
  const { data: inventoryData, error } = await sb
    .from('wh_inventory_balance')
    .select('plant_id,mm_material,on_hand_qty,reserved_qty,status')
    .order('mm_material')

  if (error) {
    console.error('Error fetching inventory:', error)
  }

  const inventoryRows = inventoryData || []

  // 2) Buscar materiais
  const materialIds = [...new Set(inventoryRows.map((r: any) => r.mm_material))]
  const { data: materialsData, error: materialsError } = materialIds.length
    ? await sb.from('mm_material').select('mm_material,mm_comercial,mm_desc,mm_purchase_price_cents').in('mm_material', materialIds)
    : { data: [], error: null }

  if (materialsError) {
    console.error('Error fetching materials:', materialsError)
  }

  // Join em memória
  const materialMap = new Map((materialsData || []).map((m: any) => [m.mm_material, m]))
  const inventory: InventoryItem[] = inventoryRows.map((item: any) => ({
    ...item,
    available_qty: Number(item.on_hand_qty) - Number(item.reserved_qty),
    mm_material_data: materialMap.get(item.mm_material)
  }))

  // Calcular estatísticas
  const totalItems = (inventory ?? []).length

  const totalValueCents = (inventory ?? []).reduce((sum, item) => {
    const qty = Number(item.on_hand_qty ?? 0)
    const unitCents = Number(item.mm_material_data?.mm_purchase_price_cents ?? 0)
    return sum + Math.round(qty * unitCents)
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
                  {formatBRL(totalValueCents)}
                </p>
              </div>
              <Package className="tile-fiori-icon" />
            </div>
          </div>

          <div className="tile-fiori">
            <div className="flex items-center justify-between">
              <div>
                <p className="tile-fiori-subtitle">Total de Itens</p>
                <p className="tile-fiori-metric">{totalItems}</p>
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
                    // Valor unitário (centavos)
                    const unitPriceCents = Number(item.mm_material_data?.mm_purchase_price_cents ?? 0)
                    
                    // Valor total (centavos)
                    const lineTotalCents = Math.round(Number(item.on_hand_qty ?? 0) * unitPriceCents)
                    
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
                          {formatBRL(unitPriceCents)}
                        </td>
                        <td className="text-right font-medium">
                          {formatBRL(lineTotalCents)}
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

