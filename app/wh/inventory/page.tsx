import Link from 'next/link'
import { supabaseServer } from '@/src/lib/supabaseServer'
import { getTenantId } from '@/src/lib/auth'
import { Search, Download, Filter, Package, AlertTriangle, XCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface InventoryItem {
  mm_material: string
  mm_comercial: string
  mm_desc: string
  collection: string
  on_hand_qty: number
  reserved_qty: number
  available_qty: number
  unit: string
  status: string
  calculated_status: string
  last_in_date: string
  last_out_date: string
  min_stock_qty: number
  warehouse_name: string
}

export default async function InventoryPage() {
  let items: InventoryItem[] = []
  let totalCount = 0

  try {
    const supabase = supabaseServer()
    const tenantId = await getTenantId()

    // Buscar itens de estoque com paginação
    const { data, count, error } = await supabase
      .from('wh_inventory_position')
      .select(`
        mm_material,
        mm_comercial,
        mm_desc,
        collection,
        on_hand_qty,
        reserved_qty,
        available_qty,
        unit,
        status,
        calculated_status,
        last_in_date,
        last_out_date,
        min_stock_qty,
        warehouse_name
      `, { count: 'exact' })
      .eq('tenant_id', tenantId)
      .order('mm_comercial')
      .limit(50)

    if (error) {
      console.error('Error loading inventory items:', error)
    } else {
      items = data || []
      totalCount = count || 0
    }

  } catch (error) {
    console.error('Error loading inventory items:', error)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Em Reposição':
        return <AlertTriangle className="w-4 h-4 text-fiori-warning" />
      case 'Zerado':
        return <XCircle className="w-4 h-4 text-fiori-danger" />
      default:
        return <Package className="w-4 h-4 text-fiori-muted" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fiori-primary">Central de Estoque</h1>
          <p className="text-fiori-secondary mt-2">
            {totalCount} item{totalCount !== 1 ? 's' : ''} em estoque
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/wh" className="btn-fiori-outline">
            Voltar para WH
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Filtros</h3>
        </div>
        <div className="card-fiori-content">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="label-fiori">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-fiori-muted" />
                <input
                  type="text"
                  placeholder="Material, coleção..."
                  className="input-fiori pl-10"
                />
              </div>
            </div>
            <div>
              <label className="label-fiori">Status</label>
              <select className="select-fiori">
                <option value="">Todos</option>
                <option value="Ativo">Ativo</option>
                <option value="Em Reposição">Em Reposição</option>
                <option value="Zerado">Zerado</option>
                <option value="Bloqueado">Bloqueado</option>
              </select>
            </div>
            <div>
              <label className="label-fiori">Coleção</label>
              <input
                type="text"
                placeholder="Nome da coleção..."
                className="input-fiori"
              />
            </div>
            <div>
              <label className="label-fiori">Depósito</label>
              <select className="select-fiori">
                <option value="">Todos</option>
                <option value="WH001">Depósito Principal</option>
              </select>
            </div>
            <div>
              <label className="label-fiori">Estoque Baixo</label>
              <select className="select-fiori">
                <option value="">Todos</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn-fiori-primary">Aplicar Filtros</button>
            <button className="btn-fiori-outline">Limpar</button>
            <button className="btn-fiori-outline flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Estoque */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Posição de Estoque</h3>
        </div>
        <div className="card-fiori-content p-0">
          {items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-fiori">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Coleção</th>
                    <th className="text-right">Estoque Total</th>
                    <th className="text-right">Reservado</th>
                    <th className="text-right">Disponível</th>
                    <th>Unidade</th>
                    <th>Status</th>
                    <th>Depósito</th>
                    <th>Última Movimentação</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.mm_material}>
                      <td>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.calculated_status)}
                          <div>
                            <div className="font-semibold text-fiori-primary">
                              {item.mm_comercial || item.mm_desc}
                            </div>
                            <div className="text-xs text-fiori-muted font-mono">
                              {item.mm_material}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {item.collection || '-'}
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="text-sm font-semibold">
                          {item.on_hand_qty.toLocaleString('pt-BR')}
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="text-sm">
                          {item.reserved_qty.toLocaleString('pt-BR')}
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="text-sm font-semibold text-fiori-primary">
                          {item.available_qty.toLocaleString('pt-BR')}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {item.unit}
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(item.calculated_status)}
                      </td>
                      <td>
                        <div className="text-sm">
                          {item.warehouse_name}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm text-fiori-muted">
                          {item.last_in_date 
                            ? new Date(item.last_in_date).toLocaleDateString('pt-BR')
                            : item.last_out_date
                            ? new Date(item.last_out_date).toLocaleDateString('pt-BR')
                            : '-'
                          }
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/wh/inventory/${item.mm_material}`}
                            className="btn-fiori-outline text-xs"
                          >
                            Ver Detalhes
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-fiori-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-lg font-semibold text-fiori-primary mb-2">Nenhum item encontrado</h3>
              <p className="text-fiori-muted">Os itens de estoque aparecerão aqui quando houver movimentações</p>
            </div>
          )}
        </div>
      </div>

      {/* Paginação */}
      {items.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-fiori-muted">
            Mostrando 1-{items.length} de {totalCount} itens
          </div>
          <div className="flex gap-2">
            <button className="btn-fiori-outline text-sm" disabled>
              Anterior
            </button>
            <button className="btn-fiori-primary text-sm">
              1
            </button>
            <button className="btn-fiori-outline text-sm" disabled>
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}