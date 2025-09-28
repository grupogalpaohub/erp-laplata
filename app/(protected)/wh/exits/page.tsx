import Link from 'next/link'
import { supabaseServer } from '@/utils/supabase/server'
import { requireSession } from '@/lib/auth/requireSession'
import { ArrowLeft, Search, Download, Filter, Package, Plus, Eye } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface ExitItem {
  exit_id: string
  material_id: string
  qty_issued: number
  unit: string
  exit_date: string
  reference_doc: string
  warehouse_id: string
  mm_material: {
    mm_material: string
    mm_comercial: string
    mm_desc: string
  }[]
}

export default async function ExitsPage() {
  let exits: ExitItem[] = []
  let totalCount = 0

  try {
    const supabase = supabaseServer()
    await requireSession()

    // Buscar saídas de estoque
    const { data, count, error } = await supabase
      .from('wh_inventory_exit')
      .select(`
        exit_id,
        material_id,
        qty_issued,
        unit,
        exit_date,
        reference_doc,
        warehouse_id,
        mm_material!inner(mm_material, mm_comercial, mm_desc)
      `, { count: 'exact' })
      
      .order('exit_date', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error loading exits:', error)
    } else {
      exits = data || []
      totalCount = count || 0
    }

  } catch (error) {
    console.error('Error loading exits:', error)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge-fiori badge-fiori-warning">Pendente</span>
      case 'CONFIRMED':
        return <span className="badge-fiori badge-fiori-success">Confirmado</span>
      case 'CANCELLED':
        return <span className="badge-fiori badge-fiori-danger">Cancelado</span>
      default:
        return <span className="badge-fiori badge-fiori-neutral">{status}</span>
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/wh" className="btn-fiori-outline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">Saídas de Estoque</h1>
          <p className="text-xl text-fiori-secondary mb-2">Registro de saídas de materiais</p>
          <p className="text-lg text-fiori-muted">Gerencie as saídas de materiais do estoque</p>
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
                  placeholder="Buscar por material ou documento..."
                  className="input-fiori pl-10 w-full sm:w-80"
                />
              </div>
              <select className="select-fiori">
                <option value="">Todos os status</option>
                <option value="PENDING">Pendente</option>
                <option value="CONFIRMED">Confirmado</option>
                <option value="CANCELLED">Cancelado</option>
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
              <Link href="/wh/exits/new" className="btn-fiori-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nova Saída
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
                <p className="text-sm text-fiori-muted">Total de Saídas</p>
                <p className="text-2xl font-bold text-fiori-primary">{totalCount}</p>
              </div>
              <Package className="w-8 h-8 text-fiori-primary" />
            </div>
          </div>
        </div>
        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Pendentes</p>
                <p className="text-2xl font-bold text-fiori-warning">
                  {exits.filter(e => e.exit_date === 'PENDING').length}
                </p>
              </div>
              <Package className="w-8 h-8 text-fiori-warning" />
            </div>
          </div>
        </div>
        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Confirmadas</p>
                <p className="text-2xl font-bold text-fiori-success">
                  {exits.filter(e => e.exit_date === 'CONFIRMED').length}
                </p>
              </div>
              <Package className="w-8 h-8 text-fiori-success" />
            </div>
          </div>
        </div>
        <div className="card-fiori">
          <div className="card-fiori-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fiori-muted">Canceladas</p>
                <p className="text-2xl font-bold text-fiori-danger">
                  {exits.filter(e => e.exit_date === 'CANCELLED').length}
                </p>
              </div>
              <Package className="w-8 h-8 text-fiori-danger" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="card-fiori">
        <div className="card-fiori-content p-0">
          {exits.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-fiori-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-fiori-primary mb-2">Nenhuma saída encontrada</h3>
              <p className="text-fiori-muted mb-6">Comece registrando uma nova saída de estoque</p>
              <Link href="/wh/exits/new" className="btn-fiori-primary">
                Nova Saída
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-fiori">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Quantidade</th>
                    <th>Data</th>
                    <th>Documento</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {exits.map((exit) => (
                    <tr key={exit.exit_id}>
                      <td>
                        <div>
                          <div className="font-semibold text-fiori-primary">
                            {exit.mm_material[0]?.mm_comercial || exit.mm_material[0]?.mm_desc || 'N/A'}
                          </div>
                          <div className="text-xs text-fiori-muted font-mono">
                            {exit.mm_material[0]?.mm_material || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="text-sm font-semibold">
                          {exit.qty_issued.toLocaleString('pt-BR')} {exit.unit}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {exit.exit_date ? new Date(exit.exit_date).toLocaleDateString('pt-BR') : '-'}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {exit.reference_doc || '-'}
                        </div>
                      </td>
                      <td>
                        {getStatusBadge('CONFIRMED')}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/wh/exits/${exit.exit_id}`}
                            className="btn-fiori-outline text-xs flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            Ver
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

