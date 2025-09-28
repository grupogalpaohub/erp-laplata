import Link from 'next/link'
import { supabaseServer } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth/requireSession'
import { ArrowLeft, Search, Download, Filter, Plus, Eye, Edit, Trash2 } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface CostCenter {
  cost_center_id: string
  cost_center_name: string
  cost_center_type: string
  total_costs_cents: number
  budget_cents: number
  is_active: boolean
  last_updated: string
}

export default async function CostsPage() {
  let costCenters: CostCenter[] = []
  let totalCount = 0

  try {
    const supabase = supabaseServer()
    await requireSession()

    // Buscar centros de custo
    const { data, count, error } = await supabase
      .from('co_cost_center')
      .select(`
        cost_center_id,
        cost_center_name,
        cost_center_type,
        total_costs_cents,
        budget_cents,
        is_active,
        last_updated
      `, { count: 'exact' })
      
      .order('cost_center_name')
      .limit(50)

    if (error) {
      console.error('Error loading cost centers:', error)
    } else {
      costCenters = data || []
      totalCount = count || 0
    }

  } catch (error) {
    console.error('Error loading cost centers:', error)
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <span className="badge-fiori badge-fiori-success">Ativo</span> : 
      <span className="badge-fiori badge-fiori-danger">Inativo</span>
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'PRODUCTION': return 'Produção'
      case 'ADMINISTRATIVE': return 'Administrativo'
      case 'SALES': return 'Vendas'
      case 'MARKETING': return 'Marketing'
      case 'RESEARCH': return 'P&D'
      default: return type
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/co" className="btn-fiori-outline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">Centros de Custo</h1>
          <p className="text-xl text-fiori-secondary mb-2">Gestão de custos e orçamentos</p>
          <p className="text-lg text-fiori-muted">Controle e análise de custos por centro</p>
        </div>
        <div className="w-20"></div> {/* Spacer para centralizar */}
      </div>

      {/* Filtros e Ações */}
      <div className="card-fiori">
        <div className="card-fiori-content">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fiori-muted w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou tipo..."
                  className="input-fiori pl-10 w-full sm:w-80"
                />
              </div>
              <select className="select-fiori">
                <option value="">Todos os tipos</option>
                <option value="PRODUCTION">Produção</option>
                <option value="ADMINISTRATIVE">Administrativo</option>
                <option value="SALES">Vendas</option>
                <option value="MARKETING">Marketing</option>
                <option value="RESEARCH">P&D</option>
              </select>
              <select className="select-fiori">
                <option value="">Todos os status</option>
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="btn-fiori-outline flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </button>
              <button className="btn-fiori-outline flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <Link href="/co/costs/new" className="btn-fiori-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Novo Centro
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Total de Centros</p>
                <p className="text-2xl font-bold text-fiori-primary">{totalCount}</p>
              </div>
              <div className="w-8 h-8 bg-fiori-primary/10 rounded-full flex items-center justify-center">
                <span className="text-fiori-primary font-bold">CC</span>
              </div>
            </div>
          </div>
        </div>
        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Centros Ativos</p>
                <p className="text-2xl font-bold text-fiori-success">
                  {costCenters.filter(c => c.is_active).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-fiori-success/10 rounded-full flex items-center justify-center">
                <span className="text-fiori-success font-bold">✓</span>
              </div>
            </div>
          </div>
        </div>
        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Custos Totais</p>
                <p className="text-2xl font-bold text-fiori-danger">
                  R$ {(costCenters.reduce((sum, c) => sum + (c.total_costs_cents || 0), 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-8 h-8 bg-fiori-danger/10 rounded-full flex items-center justify-center">
                <span className="text-fiori-danger font-bold">$</span>
              </div>
            </div>
          </div>
        </div>
        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Orçamento Total</p>
                <p className="text-2xl font-bold text-fiori-info">
                  R$ {(costCenters.reduce((sum, c) => sum + (c.budget_cents || 0), 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="w-8 h-8 bg-fiori-info/10 rounded-full flex items-center justify-center">
                <span className="text-fiori-info font-bold">B</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="card-fiori">
        <div className="card-fiori-content p-0">
          {costCenters.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-fiori-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-fiori-muted font-bold text-xl">CC</span>
              </div>
              <h3 className="text-lg font-semibold text-fiori-primary mb-2">Nenhum centro de custo encontrado</h3>
              <p className="text-fiori-muted mb-6">Comece criando um novo centro de custo</p>
              <Link href="/co/costs/new" className="btn-fiori-primary">
                Novo Centro de Custo
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-fiori">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Custos</th>
                    <th>Orçamento</th>
                    <th>Status</th>
                    <th>Última Atualização</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {costCenters.map((center) => (
                    <tr key={center.cost_center_id}>
                      <td>
                        <div>
                          <div className="font-semibold text-fiori-primary">
                            {center.cost_center_name}
                          </div>
                          <div className="text-xs text-fiori-muted font-mono">
                            {center.cost_center_id}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge-fiori badge-fiori-neutral">
                          {getTypeLabel(center.cost_center_type)}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="text-sm font-semibold text-fiori-danger">
                          R$ {((center.total_costs_cents || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="text-sm font-semibold text-fiori-info">
                          R$ {((center.budget_cents || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(center.is_active)}
                      </td>
                      <td>
                        <div className="text-sm text-fiori-muted">
                          {center.last_updated ? new Date(center.last_updated).toLocaleDateString('pt-BR') : 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/co/costs/${center.cost_center_id}`}
                            className="btn-fiori-outline text-xs flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            Ver
                          </Link>
                          <Link
                            href={`/co/costs/${center.cost_center_id}/edit`}
                            className="btn-fiori-outline text-xs flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            Editar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

