import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/src/lib/auth'
import { ArrowLeft, Edit, CheckCircle, XCircle, Printer, Mail } from 'lucide-react'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface SalesOrder {
  so_id: string
  doc_no: string
  customer_id: string
  status: string
  order_date: string
  expected_ship: string
  total_final_cents: number
  total_negotiated_cents: number
  payment_term: string
  notes: string
  created_at: string
  updated_at: string
  crm_customer: {
    name: string
    contact_email: string
    contact_phone: string
  }
}

interface OrderItem {
  material_id: string
  quantity: number
  unit_price_cents: number
  line_total_cents: number
  row_no: number
  mm_material: {
    mm_comercial: string
    mm_desc: string
  }[]
}

interface PageProps {
  params: {
    so_id: string
  }
}

export default async function SalesOrderDetailPage({ params }: PageProps) {
  let order: SalesOrder | null = null
  let items: OrderItem[] = []

  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    // Buscar dados do pedido
    const { data: orderData, error: orderError } = await supabase
      .from('sd_sales_order')
      .select(`
        *,
        crm_customer!inner(name, contact_email, contact_phone)
      `)
      .eq('tenant_id', tenantId)
      .eq('so_id', params.so_id)
      .single()

    if (orderError || !orderData) {
      notFound()
    }

    order = orderData

    // Buscar itens do pedido
    const { data: itemsData, error: itemsError } = await supabase
      .from('sd_sales_order_item')
      .select(`
        material_id,
        quantity,
        unit_price_cents,
        line_total_cents,
        row_no,
        mm_material(mm_comercial, mm_desc)
      `)
      .eq('tenant_id', tenantId)
      .eq('so_id', params.so_id)
      .order('row_no')

    if (!itemsError) {
      items = itemsData || []
    }

  } catch (error) {
    console.error('Error loading sales order details:', error)
    notFound()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="badge-fiori badge-fiori-neutral">Rascunho</span>
      case 'approved':
        return <span className="badge-fiori badge-fiori-success">Aprovado</span>
      case 'invoiced':
        return <span className="badge-fiori badge-fiori-info">Faturado</span>
      case 'cancelled':
        return <span className="badge-fiori badge-fiori-danger">Cancelado</span>
      default:
        return <span className="badge-fiori badge-fiori-neutral">{status}</span>
    }
  }

  const getStatusActions = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <div className="flex gap-3">
            <Link
              href={`/sd/orders/${order?.so_id}/edit`}
              className="btn-fiori-primary flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar
            </Link>
            <button className="btn-fiori-success flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Aprovar
            </button>
          </div>
        )
      case 'approved':
        return (
          <div className="flex gap-3">
            <button className="btn-fiori-primary flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Faturar
            </button>
            <button className="btn-fiori-danger-outline flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        )
      case 'invoiced':
        return (
          <div className="flex gap-3">
            <Link
              href={`/sd/orders/${order?.so_id}/print`}
              className="btn-fiori-outline flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </Link>
            <button className="btn-fiori-outline flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Enviar por Email
            </button>
          </div>
        )
      default:
        return (
          <div className="flex gap-3">
            <Link
              href={`/sd/orders/${order?.so_id}/print`}
              className="btn-fiori-outline flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </Link>
          </div>
        )
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/sd/orders" className="btn-fiori-outline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-fiori-primary">
              Pedido {order?.doc_no || order?.so_id}
            </h1>
            <p className="text-fiori-secondary mt-2">
              {order?.crm_customer?.name} • {order?.order_date ? new Date(order.order_date).toLocaleDateString('pt-BR') : 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {getStatusBadge(order?.status || 'DRAFT')}
          {getStatusActions(order?.status || 'DRAFT')}
        </div>
      </div>

      {/* Informações do Cliente */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Informações do Cliente</h3>
        </div>
        <div className="card-fiori-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-fiori-muted">Nome</p>
              <p className="font-semibold text-fiori-primary">{order?.crm_customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-fiori-muted">Email</p>
              <p className="font-medium">{order?.crm_customer.contact_email || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-fiori-muted">Telefone</p>
              <p className="font-medium">{order?.crm_customer.contact_phone || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Informações do Pedido */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Dados do Pedido</h3>
          </div>
          <div className="card-fiori-content space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-fiori-muted">Número do Pedido</p>
                <p className="font-semibold">{order?.doc_no || order?.so_id}</p>
              </div>
              <div>
                <p className="text-sm text-fiori-muted">Data do Pedido</p>
                <p className="font-medium">{order?.order_date ? new Date(order.order_date).toLocaleDateString('pt-BR') : 'N/A'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-fiori-muted">Forma de Pagamento</p>
                <p className="font-medium">{order?.payment_term || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-fiori-muted">Previsão de Entrega</p>
                <p className="font-medium">
                  {order?.expected_ship 
                    ? new Date(order?.expected_ship).toLocaleDateString('pt-BR')
                    : '-'
                  }
                </p>
              </div>
            </div>
            {order?.notes && (
              <div>
                <p className="text-sm text-fiori-muted">Observações</p>
                <p className="font-medium">{order?.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Valores</h3>
          </div>
          <div className="card-fiori-content space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-fiori-border">
              <span className="text-fiori-muted">Valor Final:</span>
              <span className="text-lg font-semibold text-fiori-primary">
                R$ {((order?.total_final_cents || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            {order?.total_negotiated_cents && order?.total_negotiated_cents !== order?.total_final_cents && (
              <div className="flex justify-between items-center py-2 border-b border-fiori-border">
                <span className="text-fiori-muted">Valor Negociado:</span>
                <span className="text-lg font-semibold text-fiori-warning">
                  R$ {(order?.total_negotiated_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center py-2">
              <span className="text-fiori-muted">Total de Itens:</span>
              <span className="font-medium">{items.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Itens do Pedido */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Itens do Pedido</h3>
        </div>
        <div className="card-fiori-content p-0">
          {items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-fiori">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th className="text-right">Quantidade</th>
                    <th className="text-right">Preço Unit. (R$)</th>
                    <th className="text-right">Total (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={`${item.material_id}-${item.row_no}`}>
                      <td>
                        <div>
                          <div className="font-semibold text-fiori-primary">
                            {item.mm_material[0]?.mm_comercial || item.mm_material[0]?.mm_desc || 'N/A'}
                          </div>
                          <div className="text-xs text-fiori-muted">{item.material_id}</div>
                        </div>
                      </td>
                      <td className="text-right">
                        <span className="font-medium">{item.quantity}</span>
                      </td>
                      <td className="text-right">
                        <span className="font-mono">
                          R$ {(item.unit_price_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className="font-semibold">
                          R$ {(item.line_total_cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-fiori-border">
                    <td colSpan={3} className="text-right font-semibold">
                      Total:
                    </td>
                    <td className="text-right font-bold text-lg text-fiori-primary">
                      R$ {((order?.total_final_cents || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-fiori-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-fiori-muted">Nenhum item encontrado neste pedido</p>
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
                {order?.created_at ? new Date(order.created_at).toLocaleString('pt-BR') : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-fiori-muted">Última atualização</p>
              <p className="font-medium">
                {order?.updated_at ? new Date(order.updated_at).toLocaleString('pt-BR') : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
