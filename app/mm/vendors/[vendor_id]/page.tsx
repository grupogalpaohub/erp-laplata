import Link from 'next/link'
import { ArrowLeft, Edit, Eye, Phone, Mail, MapPin, Building, Calendar } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'

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
}

async function getVendor(vendorId: string): Promise<Vendor | null> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()

    const { data, error } = await supabase
      .from('mm_vendor')
      .select('*')
      .eq('vendor_id', vendorId)
      .eq('tenant_id', tenantId)
      .single()

    if (error) {
      console.error('Error fetching vendor:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching vendor:', error)
    return null
  }
}

export default async function VendorDetailPage({ params }: { params: { vendor_id: string } }) {
  const vendor = await getVendor(params.vendor_id)

  if (!vendor) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div className="card-fiori text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Fornecedor não encontrado</h1>
          <p className="text-gray-500 mb-6">O fornecedor solicitado não foi encontrado.</p>
          <Link href="/mm/vendors" className="btn-fiori-primary">
            Voltar para Fornecedores
          </Link>
        </div>
      </main>
    )
  }

  const getPaymentTermsLabel = (terms: number) => {
    if (terms === 0) return 'PIX'
    return `${terms} dias`
  }

  const getRatingLabel = (rating: string) => {
    const ratings: { [key: string]: string } = {
      'A': 'A - Excelente',
      'B': 'B - Bom',
      'C': 'C - Regular',
      'D': 'D - Ruim'
    }
    return ratings[rating] || rating
  }

  const getStatusLabel = (status: string) => {
    return status === 'active' ? 'Ativo' : 'Inativo'
  }

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/mm/vendors" className="btn-fiori-outline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">{vendor.vendor_name}</h1>
            <p className="text-gray-500 mt-1">Detalhes do fornecedor</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link 
            href={`/mm/vendors/${vendor.vendor_id}/edit`}
            className="btn-fiori-outline flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <div className="card-fiori">
            <h2 className="text-lg font-semibold mb-4">Informações Básicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">ID do Fornecedor</label>
                <p className="text-lg font-mono text-blue-600">{vendor.vendor_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(vendor.status)}`}>
                    {getStatusLabel(vendor.status)}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Documento (CPF/CNPJ)</label>
                <p className="text-lg font-mono">{vendor.tax_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Avaliação</label>
                <p className="text-lg">{getRatingLabel(vendor.rating)}</p>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="card-fiori">
            <h2 className="text-lg font-semibold mb-4">Informações de Contato</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-500">E-mail</label>
                  <p className="text-lg">{vendor.email}</p>
                </div>
              </div>
              {vendor.telefone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Telefone</label>
                    <p className="text-lg">{vendor.telefone}</p>
                  </div>
                </div>
              )}
              {vendor.contact_person && (
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Pessoa de Contato</label>
                    <p className="text-lg">{vendor.contact_person}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Endereço */}
          <div className="card-fiori">
            <h2 className="text-lg font-semibold mb-4">Endereço</h2>
            <div className="space-y-4">
              {vendor.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Endereço</label>
                    <p className="text-lg">{vendor.address}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Cidade/Estado</label>
                  <p className="text-lg">
                    {vendor.cidade && vendor.estado 
                      ? `${vendor.cidade}/${vendor.estado}` 
                      : vendor.city && vendor.state 
                      ? `${vendor.city}/${vendor.state}` 
                      : '-'
                    }
                  </p>
                </div>
              </div>
              {vendor.zip_code && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">CEP</label>
                    <p className="text-lg font-mono">{vendor.zip_code}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-500">País</label>
                  <p className="text-lg">{vendor.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Condições de Pagamento */}
          <div className="card-fiori">
            <h2 className="text-lg font-semibold mb-4">Condições de Pagamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Prazo de Pagamento</label>
                <p className="text-lg">{getPaymentTermsLabel(vendor.payment_terms)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resumo */}
          <div className="card-fiori">
            <h3 className="text-lg font-semibold mb-4">Resumo</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(vendor.status)}`}>
                  {getStatusLabel(vendor.status)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avaliação:</span>
                <span className="font-semibold">{getRatingLabel(vendor.rating)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pagamento:</span>
                <span className="font-semibold">{getPaymentTermsLabel(vendor.payment_terms)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Criado em: {new Date(vendor.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="card-fiori">
            <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
            <div className="space-y-2">
              <Link 
                href={`/mm/vendors/${vendor.vendor_id}/edit`}
                className="btn-fiori-primary w-full flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar Fornecedor
              </Link>
              <Link 
                href={`/mm/purchases/new?vendor=${vendor.vendor_id}`}
                className="btn-fiori-outline w-full flex items-center justify-center gap-2"
              >
                <Building className="w-4 h-4" />
                Novo Pedido
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
