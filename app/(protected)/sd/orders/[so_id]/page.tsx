import Link from 'next/link'
import { supabaseServer } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth/requireSession'
import { formatBRL } from '@/lib/money'
import { ArrowLeft, Edit, CheckCircle, XCircle, DollarSign, Percent } from 'lucide-react'
import ExpeditionButton from './ExpeditionButton'
import ConfirmOrderButton from './ConfirmOrderButton'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface SalesOrder {
  so_id: string
  doc_no?: string
  customer_id: string
  status: string
  order_date: string
  expected_ship?: string
  total_cents: number
  total_final_cents?: number
  total_negotiated_cents?: number
  payment_method?: string
  payment_term?: string
  notes?: string
  created_at: string
  crm_customer: {
    name: string
  }[]
}

interface OrderItem {
  so_id: string
  sku: string
  quantity: number
  unit_price_cents: number
  line_total_cents: number
  row_no: number
  mm_material: string
}

export default async function SalesOrderDetailPage({ params }: { params: { so_id: string } }) {
  await requireSession()
  const { so_id } = params
  let order: SalesOrder | null = null
  let items: OrderItem[] = []
  let error = ''

  try {
    const supabase = supabaseServer()
    
    // RLS filtra automaticamente por tenant_id - não precisa derivar manualmente

    // Buscar pedido
    const { data: orderData, error: orderError } = await supabase
      .from('sd_sales_order')
      .select(`
        so_id,
        doc_no,
        customer_id,
        status,
        order_date,
        expected_ship,
        total_cents,
        total_final_cents,
        total_negotiated_cents,
        payment_method,
        payment_term,
        notes,
        created_at
      `)
      .eq('so_id', so_id)
      .single()

    if (orderError) {
      error = orderError.message
    } else {
      order = orderData as any

      // Buscar dados do cliente separadamente
      if (order?.customer_id) {
        const { data: customerData } = await supabase
          .from('crm_customer')
          .select('name')
          .eq('customer_id', order?.customer_id)
          .single()
        
        if (customerData) {
          order.crm_customer = [{ name: customerData.name }]
        }
      }

      // Buscar itens do pedido
      const { data: itemsData, error: itemsError } = await supabase
        .from('sd_sales_order_item')
        .select(`
          so_id,
          sku,
          quantity,
          unit_price_cents,
          line_total_cents,
          row_no,
          mm_material,
          material:mm_material!inner (
            mm_desc,
            mm_comercial
          )
        `)
        .eq('so_id', so_id)
        .order('row_no')

      if (itemsError) {
        console.error('Error fetching order items:', itemsError)
      } else {
        items = itemsData || []
      }
    }
  } catch (err) {
    console.error('Error loading sales order:', err)
    error = 'Erro ao carregar pedido'
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card-fiori">
          <div className="card-fiori-content text-center">
            <h1 className="text-2xl font-bold text-fiori-text mb-4">Pedido não encontrado</h1>
            <p className="text-fiori-muted mb-6">{error}</p>
            <Link href="/sd/orders" className="btn-fiori">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Pedidos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Cálculos de KPIs
  const totalFinal = order.total_final_cents || order.total_cents || 0
  const totalNegotiated = order.total_negotiated_cents || totalFinal
  const totalItems = items.reduce((sum, item) => sum + item.line_total_cents, 0)
  
  // Margem e lucro (simplificado - sem custo por enquanto)
  const margin = totalNegotiated - totalItems
  const marginPercent = totalItems > 0 ? (margin / totalItems) * 100 : 0

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <XCircle className="w-4 h-4 text-yellow-500" />
      case 'placed': return <CheckCircle className="w-4 h-4 text-blue-500" />
      case 'received': return <CheckCircle className="w-4 h-4 text-green-500" />
      default: return <XCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Rascunho'
      case 'placed': return 'Enviado'
      case 'received': return 'Recebido'
      default: return status
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/sd/orders" className="btn-fiori-outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-fiori-text">
              Pedido {order.doc_no || order.so_id}
            </h1>
            <p className="text-fiori-muted">
              Cliente: {order.crm_customer?.[0]?.name || 'Não encontrado'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(order.status)}
          <span className="font-medium">{getStatusText(order.status)}</span>
          {order.status === 'draft' && (
            <>
              <Link href={`/sd/orders/${so_id}/edit`} className="btn-fiori-outline">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Link>
              <ConfirmOrderButton 
                soId={so_id} 
                currentStatus={order.status}
                onConfirm={() => window.location.reload()}
              />
            </>
          )}
          {order.status === 'approved' && (
            <ExpeditionButton so_id={so_id} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Pedido */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detalhes Básicos */}
          <div className="card-fiori">
            <div className="card-fiori-header">
              <h3 className="card-fiori-title">Informações do Pedido</h3>
            </div>
            <div className="card-fiori-content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-fiori">Número do Pedido</label>
                  <p className="font-mono text-fiori-primary">{order.doc_no || order.so_id}</p>
                </div>
                <div>
                  <label className="label-fiori">Data do Pedido</label>
                  <p>{new Date(order.order_date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <label className="label-fiori">Cliente</label>
                  <p>{order.crm_customer?.[0]?.name || 'Não encontrado'}</p>
                </div>
                <div>
                  <label className="label-fiori">Status</label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span>{getStatusText(order.status)}</span>
                  </div>
                </div>
                {order.payment_method && (
                  <div>
                    <label className="label-fiori">Forma de Pagamento</label>
                    <p>{order.payment_method}</p>
                  </div>
                )}
                {order.payment_term && (
                  <div>
                    <label className="label-fiori">Condição de Pagamento</label>
                    <p>{order.payment_term}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Itens do Pedido */}
          <div className="card-fiori">
            <div className="card-fiori-header">
              <h3 className="card-fiori-title">Itens do Pedido</h3>
            </div>
            <div className="card-fiori-content p-0">
              <div className="overflow-x-auto">
                <table className="table-fiori">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th className="text-right">Qtd</th>
                      <th className="text-right">Preço Unit.</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(items ?? []).map((item) => (
                      <tr key={item.row_no}>
                        <td>
                          <div>
                            <div className="font-medium">
                              {item.sku}
                            </div>
                            <div className="text-sm text-fiori-muted">
                              {item.mm_material}
                            </div>
                          </div>
                        </td>
                        <td className="text-right">{item.quantity}</td>
                        <td className="text-right">
                          {formatBRL(item.unit_price_cents)}
                        </td>
                        <td className="text-right font-medium">
                          {formatBRL(item.line_total_cents)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs e Totais */}
        <div className="space-y-6">
          {/* Totais */}
          <div className="card-fiori">
            <div className="card-fiori-header">
              <h3 className="card-fiori-title">Totais</h3>
            </div>
            <div className="card-fiori-content space-y-4">
              <div className="flex justify-between">
                <span>Total dos Itens:</span>
                <span className="font-medium">
                  {formatBRL(totalItems)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Final:</span>
                <span className="font-medium">
                  {formatBRL(totalFinal)}
                </span>
              </div>
              {totalNegotiated !== totalFinal && (
                <div className="flex justify-between text-fiori-primary">
                  <span>Total Negociado:</span>
                  <span className="font-bold">
                    {formatBRL(totalNegotiated)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* KPIs */}
          <div className="card-fiori">
            <div className="card-fiori-header">
              <h3 className="card-fiori-title">Análise Financeira</h3>
            </div>
            <div className="card-fiori-content space-y-4">
              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Margem (R$):
                </span>
                <span className={`font-medium ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {margin >= 0 ? '+' : ''}{formatBRL(margin)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Margem (%):
                </span>
                <span className={`font-medium ${marginPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {marginPercent >= 0 ? '+' : ''}{marginPercent.toFixed(1)}%
                </span>
              </div>
              <div className="text-xs text-fiori-muted">
                * Cálculo baseado na diferença entre valor negociado e total dos itens
              </div>
            </div>
          </div>

          {/* Observações */}
          {order.notes && (
            <div className="card-fiori">
              <div className="card-fiori-header">
                <h3 className="card-fiori-title">Observações</h3>
              </div>
              <div className="card-fiori-content">
                <p className="text-sm">{order.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}