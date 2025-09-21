import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'
import { Search, Download, Plus, Eye, Edit } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface Vendor {
  vendor_id: string
  vendor_name: string
  contact_email: string
  contact_phone: string
  phone_country: string
  addr_city: string
  addr_state: string
  payment_terms: string
  is_active: boolean
  created_at: string
  updated_at: string
  total_moved_cents: number
}

export default async function VendorsPage() {
  let vendors: Vendor[] = []
  let totalCount = 0

  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    // Buscar fornecedores com total movimentado
    const { data, count, error } = await supabase
      .from('mm_vendors_with_total')
      .select(`
        vendor_id,
        vendor_name,
        contact_email,
        contact_phone,
        phone_country,
        addr_city,
        addr_state,
        payment_terms,
        is_active,
        created_at,
        updated_at,
        total_moved_cents
      `, { count: 'exact' })
      .eq('tenant_id', tenantId)
      .order('vendor_name')
      .limit(25)

    if (error) {
      console.error('Error loading vendors:', error)
    } else {
      vendors = data || []
      totalCount = count || 0
    }

  } catch (error) {
    console.error('Error loading vendors:', error)
  }

  const formatPhone = (phone: string, country: string) => {
    if (!phone) return '-'
    if (country === 'BR') {
      const cleaned = phone.replace(/\D/g, '')
      if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
      }
      return phone
    }
    return phone
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="badge-fiori badge-fiori-success">Ativo</span>
    ) : (
      <span className="badge-fiori badge-fiori-danger">Inativo</span>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fiori-primary">Central de Fornecedores</h1>
          <p className="text-fiori-secondary mt-2">
            {totalCount} fornecedor{totalCount !== 1 ? 'es' : ''} cadastrado{totalCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/mm" className="btn-fiori-outline">
            Voltar para MM
          </Link>
          <Link href="/mm/vendors/new" className="btn-fiori-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Fornecedor
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Filtros</h3>
        </div>
        <div className="card-fiori-content">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="label-fiori">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-fiori-muted" />
                <input
                  type="text"
                  placeholder="Nome, email ou telefone..."
                  className="input-fiori pl-10"
                />
              </div>
            </div>
            <div>
              <label className="label-fiori">Status</label>
              <select className="select-fiori">
                <option value="">Todos</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
            <div>
              <label className="label-fiori">Forma de Pagamento</label>
              <select className="select-fiori">
                <option value="">Todas</option>
                <option value="PIX">PIX</option>
                <option value="TRANSFERENCIA">Transferência</option>
                <option value="BOLETO">Boleto</option>
                <option value="CARTAO">Cartão</option>
              </select>
            </div>
            <div>
              <label className="label-fiori">Cidade/UF</label>
              <input
                type="text"
                placeholder="Cidade ou estado..."
                className="input-fiori"
              />
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

      {/* Tabela de Fornecedores */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Lista de Fornecedores</h3>
        </div>
        <div className="card-fiori-content p-0">
          {vendors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-fiori">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fornecedor</th>
                    <th>Contato</th>
                    <th>Telefone</th>
                    <th>Cidade/UF</th>
                    <th>Forma de Pagamento</th>
                    <th>Status</th>
                    <th>Total Movimentado (R$)</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor) => (
                    <tr key={vendor.vendor_id}>
                      <td>
                        <span className="font-mono text-sm text-fiori-primary">
                          {vendor.vendor_id}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div className="font-semibold text-fiori-primary">{vendor.vendor_name}</div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">{vendor.contact_email || '-'}</div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {formatPhone(vendor.contact_phone, vendor.phone_country)}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {vendor.addr_city && vendor.addr_state 
                            ? `${vendor.addr_city}/${vendor.addr_state}`
                            : '-'
                          }
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {vendor.payment_terms || '-'}
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(vendor.is_active)}
                      </td>
                      <td>
                        <div className="text-sm font-semibold">
                          R$ {(vendor.total_moved_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/mm/vendors/${vendor.vendor_id}`}
                            className="btn-fiori-outline text-xs flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            Ver
                          </Link>
                          <Link
                            href={`/mm/vendors/${vendor.vendor_id}/edit`}
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
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-fiori-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-lg font-semibold text-fiori-primary mb-2">Nenhum fornecedor encontrado</h3>
              <p className="text-fiori-muted mb-4">Comece cadastrando seu primeiro fornecedor</p>
              <Link href="/mm/vendors/new" className="btn-fiori-primary">
                Cadastrar Fornecedor
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Paginação */}
      {vendors.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-fiori-muted">
            Mostrando 1-{vendors.length} de {totalCount} fornecedores
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
