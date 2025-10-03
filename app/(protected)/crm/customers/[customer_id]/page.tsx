import Link from 'next/link'
import { supabaseServer } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth/requireSession'
import { formatBRL } from '@/lib/money'
import { ArrowLeft, Edit, Mail, Phone, MapPin, CreditCard, Calendar, User, Star, Target, ShoppingCart, Tag } from 'lucide-react'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface Customer {
  customer_id: string
  name: string
  contact_email: string
  contact_phone: string
  phone_country: string
  document_id: string
  contact_name: string
  addr_street: string
  addr_number: string
  addr_complement: string
  addr_district: string
  addr_city: string
  addr_state: string
  addr_zip: string
  addr_country: string
  is_active: boolean
  customer_type: string
  created_date: string
  updated_at: string
  // Campos CRM
  customer_category: string
  lead_classification: string
  sales_channel: string
  notes: string
  preferred_payment_method: string
  preferred_payment_terms: string
}

interface PageProps {
  params: {
    customer_id: string
  }
}

export default async function CustomerDetailPage({ params }: PageProps) {
  let customer: Customer | null = null
  let salesOrders: any[] = []
  let totalSalesValue = 0

  try {
    const supabase = supabaseServer()
    await requireSession()

    // Buscar dados do cliente
    const { data: customerData, error: customerError } = await supabase
      .from('crm_customer')
      .select('*')
      
      .eq('customer_id', params.customer_id)
      .single()

    if (customerError || !customerData) {
      notFound()
    }

    customer = customerData

    // Buscar pedidos de venda do cliente
    const { data: ordersData, error: ordersError } = await supabase
      .from('sd_sales_order')
      .select(`
        so_id,
        doc_no,
        status,
        order_date,
        total_cents,
        total_final_cents,
        total_negotiated_cents,
        payment_method,
        payment_term,
        created_at
      `)
      .eq('customer_id', params.customer_id)
      .order('order_date', { ascending: false })
      .limit(10)

    if (ordersError) {
      console.error('Error loading customer orders:', ordersError)
      salesOrders = []
      totalSalesValue = 0
    } else {
      salesOrders = ordersData || []
      totalSalesValue = salesOrders.reduce((sum: number, order: any) => sum + (order.total_cents || 0), 0)
    }

  } catch (error) {
    console.error('Error loading customer details:', error)
    notFound()
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

  const formatDocument = (document: string, type: string) => {
    if (!document) return '-'
    if (type === 'PJ') {
      // CNPJ: 00.000.000/0000-00
      const cleaned = document.replace(/\D/g, '')
      if (cleaned.length === 14) {
        return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`
      }
    } else {
      // CPF: 000.000.000-00
      const cleaned = document.replace(/\D/g, '')
      if (cleaned.length === 11) {
        return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`
      }
    }
    return document
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="badge-fiori badge-fiori-success">Ativo</span>
    ) : (
      <span className="badge-fiori badge-fiori-danger">Inativo</span>
    )
  }

  const getCustomerTypeLabel = (type: string) => {
    return type === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'
  }

  const getCustomerCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'VIP': 'VIP',
      'REGULAR': 'Regular',
      'CORPORATIVO': 'Corporativo',
      'PESSOA_FISICA': 'Pessoa Física',
      'PESSOA_JURIDICA': 'Pessoa Jurídica',
      'DISTRIBUIDOR': 'Distribuidor',
      'REVENDEDOR': 'Revendedor'
    }
    return labels[category] || category
  }

  const getLeadClassificationLabel = (classification: string) => {
    const labels: { [key: string]: string } = {
      'novo': 'Novo',
      'em_contato': 'Em Contato',
      'qualificado': 'Qualificado',
      'convertido': 'Convertido',
      'perdido': 'Perdido'
    }
    return labels[classification] || classification
  }

  const getSalesChannelLabel = (channel: string) => {
    const labels: { [key: string]: string } = {
      'whatsapp': 'WhatsApp',
      'instagram': 'Instagram',
      'facebook': 'Facebook',
      'site': 'Site',
      'indicacao': 'Indicação',
      'familia_amigos': 'Família/Amigos'
    }
    return labels[channel] || channel
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/crm/customers" className="btn-fiori-outline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-fiori-primary">{customer?.name}</h1>
            <p className="text-fiori-secondary mt-2">
              {customer?.customer_type ? getCustomerTypeLabel(customer.customer_type) : 'N/A'} • {customer?.customer_id}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/crm/customers/${customer?.customer_id}/edit`}
            className="btn-fiori-primary flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar
          </Link>
        </div>
      </div>

      {/* Status e Informações Básicas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-fiori">
          <div className="card-fiori-content text-center">
            <div className="w-12 h-12 bg-fiori-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-fiori-primary" />
            </div>
            <h3 className="font-semibold text-fiori-primary">Status</h3>
            <div className="mt-2">
              {getStatusBadge(customer?.is_active ?? false)}
            </div>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-content text-center">
            <div className="w-12 h-12 bg-fiori-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-fiori-success" />
            </div>
            <h3 className="font-semibold text-fiori-primary">Cliente desde</h3>
            <p className="text-fiori-secondary mt-1">
              {customer?.created_date ? new Date(customer.created_date).toLocaleDateString('pt-BR') : 'N/A'}
            </p>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-content text-center">
            <div className="w-12 h-12 bg-fiori-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-6 h-6 text-fiori-warning" />
            </div>
            <h3 className="font-semibold text-fiori-primary">Pedidos</h3>
            <p className="text-fiori-secondary mt-1">
              {salesOrders.length} pedido{salesOrders.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-content text-center">
            <div className="w-12 h-12 bg-fiori-info/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-6 h-6 text-fiori-info" />
            </div>
            <h3 className="font-semibold text-fiori-primary">Valor Total</h3>
            <p className="text-fiori-secondary mt-1">
              {formatBRL(totalSalesValue)}
            </p>
          </div>
        </div>
      </div>

      {/* Tiles CRM - Segunda Linha */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-fiori">
          <div className="card-fiori-content text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-fiori-primary">Método de Pagamento Favorito</h3>
            <p className="text-fiori-secondary mt-1">
              {customer?.preferred_payment_method || 'Não definido'}
            </p>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-content text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-fiori-primary">Canal de Vendas</h3>
            <p className="text-fiori-secondary mt-1">
              {customer?.sales_channel ? getSalesChannelLabel(customer.sales_channel) : 'Não definido'}
            </p>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-content text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-fiori-primary">Classificação do Lead</h3>
            <p className="text-fiori-secondary mt-1">
              {customer?.lead_classification ? getLeadClassificationLabel(customer.lead_classification) : 'Não definido'}
            </p>
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-content text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Tag className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-fiori-primary">Categoria do Cliente</h3>
            <p className="text-fiori-secondary mt-1">
              {customer?.customer_category ? getCustomerCategoryLabel(customer.customer_category) : 'Não definido'}
            </p>
          </div>
        </div>
      </div>

      {/* Informações Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dados de Contato */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Dados de Contato</h3>
          </div>
          <div className="card-fiori-content space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-fiori-muted" />
              <div>
                <p className="text-sm text-fiori-muted">Email</p>
                <p className="font-medium">{customer?.contact_email || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-fiori-muted" />
              <div>
                <p className="text-sm text-fiori-muted">Telefone</p>
                <p className="font-medium">
                  {customer?.contact_phone ? formatPhone(customer.contact_phone, customer?.phone_country || 'BR') : 'N/A'}
                </p>
              </div>
            </div>
            {customer?.contact_name && (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-fiori-muted" />
                <div>
                  <p className="text-sm text-fiori-muted">Pessoa de Contato</p>
                  <p className="font-medium">{customer?.contact_name}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Endereço */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Endereço</h3>
          </div>
          <div className="card-fiori-content">
            {customer?.addr_street ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-fiori-muted" />
                  <div>
                    <p className="font-medium">
                      {customer?.addr_street}
                      {customer?.addr_number && `, ${customer?.addr_number}`}
                      {customer?.addr_complement && ` - ${customer?.addr_complement}`}
                    </p>
                    <p className="text-sm text-fiori-muted">
                      {customer?.addr_district && `${customer?.addr_district}, `}
                      {customer?.addr_city && customer?.addr_state 
                        ? `${customer?.addr_city}/${customer?.addr_state}`
                        : customer?.addr_city || customer?.addr_state
                      }
                      {customer?.addr_zip && ` - ${customer?.addr_zip}`}
                    </p>
                    <p className="text-sm text-fiori-muted">
                      {customer?.addr_country === 'BR' ? 'Brasil' : customer?.addr_country}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-fiori-muted">Endereço não informado</p>
            )}
            
            {/* Observações */}
            {customer?.notes && (
              <div className="mt-4 pt-4 border-t border-fiori-border">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-fiori-muted mt-0.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-fiori-muted mb-1">Observações</p>
                    <p className="text-sm font-medium text-fiori-text whitespace-pre-wrap">
                      {customer.notes}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Documentos */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Documentos</h3>
        </div>
        <div className="card-fiori-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-fiori-muted">Tipo</p>
              <p className="font-medium">{customer?.customer_type ? getCustomerTypeLabel(customer.customer_type) : 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-fiori-muted">
                {customer?.customer_type === 'PJ' ? 'CNPJ' : 'CPF'}
              </p>
              <p className="font-medium">
                {customer?.document_id ? formatDocument(customer.document_id, customer?.customer_type || 'PF') : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de Pedidos (quando implementado) */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Histórico de Pedidos</h3>
        </div>
        <div className="card-fiori-content">
          {salesOrders.length > 0 ? (
            <div className="space-y-4">
              {salesOrders.map((order: any) => (
                <div key={order.so_id} className="border border-fiori-border rounded-lg p-4 hover:bg-fiori-surface transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-fiori-primary/10 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-fiori-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-fiori-primary">
                          {order.doc_no || order.so_id}
                        </h4>
                        <p className="text-sm text-fiori-muted">
                          {new Date(order.order_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-fiori-primary">
                        {formatBRL(order.total_cents || 0)}
                      </p>
                      <p className="text-sm text-fiori-muted">
                        {order.status === 'draft' ? 'Rascunho' : 
                         order.status === 'approved' ? 'Aprovado' :
                         order.status === 'invoiced' ? 'Faturado' :
                         order.status === 'cancelled' ? 'Cancelado' : order.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm text-fiori-muted">
                    <span>Pagamento: {order.payment_method || order.payment_term || 'N/A'}</span>
                    {order.total_negotiated_cents && order.total_negotiated_cents !== order.total_cents && (
                      <span>Negociado: {formatBRL(order.total_negotiated_cents)}</span>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/sd/orders/${order.so_id}`}
                      className="btn-fiori-outline text-xs"
                    >
                      Ver Detalhes
                    </Link>
                    <Link
                      href={`/sd/orders/${order.so_id}/edit`}
                      className="btn-fiori-outline text-xs"
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-fiori-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-fiori-muted">Nenhum pedido encontrado</p>
              <p className="text-sm text-fiori-muted mt-1">
                Este cliente ainda não possui pedidos de venda
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Informações de Auditoria */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Informações de Auditoria</h3>
        </div>
        <div className="card-fiori-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-fiori-muted">Criado em</p>
              <p className="font-medium">
                {customer?.created_date ? new Date(customer.created_date).toLocaleString('pt-BR') : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-fiori-muted">Última atualização</p>
              <p className="font-medium">
                {customer?.updated_at ? new Date(customer.updated_at).toLocaleString('pt-BR') : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
