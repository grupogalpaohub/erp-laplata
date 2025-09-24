import Link from 'next/link'
import { ArrowLeft, Plus, Search, Edit, Eye } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'
import ExportCSVButton from './ExportCSVButton'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Vendor {
  vendor_id: string
  vendor_name: string
  email: string
  telefone: string
  cidade: string
  estado: string
  contact_person: string
  address: string
  city: string
  state: string
  zip_code: string
  country: string
  tax_id: string
  payment_terms: number
  rating: string
  status: string
  created_at: string
  total_movimentado?: number
}

export default async function VendorsPage() {
  let vendors: Vendor[] = []
  let totalVendors = 0
  let activeVendors = 0

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()

    // Buscar fornecedores com total movimentado
    const { data, error } = await supabase
      .from('mm_vendor')
      .select(`
        vendor_id,
        vendor_name,
        email,
        telefone,
        cidade,
        estado,
        contact_person,
        address,
        city,
        state,
        zip_code,
        country,
        tax_id,
        payment_terms,
        rating,
        status,
        created_at
      `)
      .eq('tenant_id', tenantId)
      .order('vendor_name', { ascending: true })

    if (error) {
      console.error('Erro ao buscar fornecedores:', error)
    } else {
      vendors = data || []
      totalVendors = vendors.length
      activeVendors = vendors.filter(v => v.status === 'active').length
    }

  } catch (error) {
    console.error('Error loading vendors data:', error)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/mm" className="btn-fiori-outline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">Central de Fornecedores</h1>
          <p className="text-xl text-fiori-secondary mb-2">Gestão de fornecedores</p>
          <p className="text-lg text-fiori-muted">Gerencie fornecedores e relacionamentos</p>
        </div>
        <Link href="/mm/vendors/new" className="btn-fiori-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Fornecedor
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="tile-fiori">
          <div className="flex items-center justify-between mb-4">
            <h3 className="tile-fiori-title text-sm">Total de Fornecedores</h3>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="kpi-fiori kpi-fiori-primary">{totalVendors}</div>
          <p className="tile-fiori-metric-label">Fornecedores cadastrados</p>
        </div>

        <div className="tile-fiori">
          <div className="flex items-center justify-between mb-4">
            <h3 className="tile-fiori-title text-sm">Fornecedores Ativos</h3>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="kpi-fiori kpi-fiori-success">{activeVendors}</div>
          <p className="tile-fiori-metric-label">Fornecedores ativos</p>
        </div>

        <div className="tile-fiori">
          <div className="flex items-center justify-between mb-4">
            <h3 className="tile-fiori-title text-sm">Taxa de Atividade</h3>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="kpi-fiori kpi-fiori-info">
            {totalVendors > 0 ? Math.round((activeVendors / totalVendors) * 100) : 0}%
          </div>
          <p className="tile-fiori-metric-label">Taxa de atividade</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="tile-fiori">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar fornecedores..."
                className="input-fiori pl-10"
              />
            </div>
          </div>
          <select className="input-fiori">
            <option value="">Todos os status</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
          <select className="input-fiori">
            <option value="">Todos os estados</option>
            <option value="SP">São Paulo</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="MG">Minas Gerais</option>
          </select>
          <ExportCSVButton vendors={vendors} />
        </div>
      </div>

      {/* Tabela de Fornecedores */}
      <div className="tile-fiori">
        <div className="overflow-x-auto">
          <table className="table-fiori">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fornecedor</th>
                <th>Documento</th>
                <th>Contato</th>
                <th>Telefone</th>
                <th>Cidade/UF</th>
                <th>Payment Terms</th>
                <th>Status</th>
                <th>Total Movimentado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-gray-500">
                    Nenhum fornecedor encontrado
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor.vendor_id}>
                    <td>
                      <Link 
                        href={`/mm/vendors/${vendor.vendor_id}`}
                        className="text-fiori-primary hover:underline font-mono"
                      >
                        {vendor.vendor_id}
                      </Link>
                    </td>
                    <td className="font-medium">{vendor.vendor_name}</td>
                    <td className="font-mono text-sm">{vendor.tax_id || '-'}</td>
                    <td>{vendor.contact_person || vendor.email || '-'}</td>
                    <td>{vendor.telefone || '-'}</td>
                    <td>
                      {vendor.cidade && vendor.estado 
                        ? `${vendor.cidade}/${vendor.estado}` 
                        : vendor.city && vendor.state 
                        ? `${vendor.city}/${vendor.state}` 
                        : '-'
                      }
                    </td>
                    <td>{vendor.payment_terms ? `${vendor.payment_terms} dias` : '-'}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        vendor.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vendor.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="font-mono">
                      R$ {(vendor.total_movimentado || 0).toLocaleString('pt-BR', { 
                        minimumFractionDigits: 2 
                      })}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link 
                          href={`/mm/vendors/${vendor.vendor_id}`}
                          className="btn-fiori-outline btn-sm"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link 
                          href={`/mm/vendors/${vendor.vendor_id}/edit`}
                          className="btn-fiori-outline btn-sm"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {vendors.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Mostrando {vendors.length} de {vendors.length} fornecedores
            </div>
            <div className="flex gap-2">
              <button className="btn-fiori-outline btn-sm" disabled>
                Anterior
              </button>
              <button className="btn-fiori-primary btn-sm">
                1
              </button>
              <button className="btn-fiori-outline btn-sm" disabled>
                Próximo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
