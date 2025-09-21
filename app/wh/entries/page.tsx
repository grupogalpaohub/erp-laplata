import Link from 'next/link'
import { supabaseServer } from '@/src/lib/supabaseServer'
import { getTenantId } from '@/src/lib/auth'
import { ArrowLeft, Search, Download, Filter, Package, Plus, Eye } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface EntryItem {
  entry_id: string
  material_id: string
  qty_received: number
  unit: string
  entry_date: string
  reference_doc: string
  warehouse_id: string
  mm_material: {
    mm_material: string
    mm_comercial: string
    mm_desc: string
  }[]
}

export default async function EntriesPage() {
  let entries: EntryItem[] = []
  let totalCount = 0

  try {
    const supabase = supabaseServer()
    const tenantId = await getTenantId()

    // Buscar entradas de estoque
    const { data, count, error } = await supabase
      .from('wh_inventory_entry')
      .select(`
        entry_id,
        material_id,
        qty_received,
        unit,
        entry_date,
        reference_doc,
        warehouse_id,
        mm_material!inner(mm_material, mm_comercial, mm_desc)
      `, { count: 'exact' })
      .eq('tenant_id', tenantId)
      .order('entry_date', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error loading entries:', error)
    } else {
      entries = data || []
      totalCount = count || 0
    }

  } catch (error) {
    console.error('Error loading entries:', error)
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
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">Entradas de Estoque</h1>
          <p className="text-xl text-fiori-secondary mb-2">Registro de entradas de materiais</p>
          <p className="text-lg text-fiori-muted">Gerencie as entradas de materiais no estoque</p>
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
              <Link href="/wh/entries/new" className="btn-fiori-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nova Entrada
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
                <p className="text-sm text-fiori-muted">Total de Entradas</p>
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
                  {entries.filter(e => e.entry_date === 'PENDING').length}
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
                  {entries.filter(e => e.entry_date === 'CONFIRMED').length}
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
                  {entries.filter(e => e.entry_date === 'CANCELLED').length}
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
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-fiori-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-fiori-primary mb-2">Nenhuma entrada encontrada</h3>
              <p className="text-fiori-muted mb-6">Comece registrando uma nova entrada de estoque</p>
              <Link href="/wh/entries/new" className="btn-fiori-primary">
                Nova Entrada
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
                  {entries.map((entry) => (
                    <tr key={entry.entry_id}>
                      <td>
                        <div>
                          <div className="font-semibold text-fiori-primary">
                            {entry.mm_material[0]?.mm_comercial || entry.mm_material[0]?.mm_desc || 'N/A'}
                          </div>
                          <div className="text-xs text-fiori-muted font-mono">
                            {entry.mm_material[0]?.mm_material || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="text-sm font-semibold">
                          {entry.qty_received.toLocaleString('pt-BR')} {entry.unit}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {entry.entry_date ? new Date(entry.entry_date).toLocaleDateString('pt-BR') : '-'}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {entry.reference_doc || '-'}
                        </div>
                      </td>
                      <td>
                        {getStatusBadge('CONFIRMED')}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/wh/entries/${entry.entry_id}`}
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
