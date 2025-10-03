import Link from 'next/link'
import { supabaseServer } from '@/lib/supabase/server'
import { formatBRL } from '@/lib/money'
import { Search, Download, Plus, Eye, Edit, CheckCircle, XCircle } from 'lucide-react'
import StatusActionButtons from './StatusActionButtons'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

// Forçar atualização da página
export async function generateMetadata() {
  return {
    title: 'Pedidos de Venda',
    description: 'Lista de pedidos de venda'
  }
}

interface SalesOrder {
  so_id: string
  doc_no?: string
  customer_id: string
  status: string
  order_date: string
  expected_ship: string
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

export default async function SalesOrdersPage() {
  let orders: SalesOrder[] = []
  let totalCount = 0

  try {
    const supabase = supabaseServer()
    
    // Obter tenant_id da sessão
    const { data: { session } } = await supabase.auth.getSession()
    const tenant_id = session?.user?.user_metadata?.tenant_id || 'LaplataLunaria'
    
    // Sessão e tenant verificados via RLS

    // Buscar pedidos com paginação
    const { data, count, error } = await supabase
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
      `, { count: 'exact' })
      .eq('tenant_id', tenant_id)
      .order('order_date', { ascending: false })
      .limit(25)

    if (error) {
      console.error('Error loading sales orders:', error)
    } else {
      orders = data || []
      totalCount = count || 0
      
      // 🔍 DEBUG: Verificar dados retornados
      console.log('🔍 [DEBUG] Orders loaded from Supabase:', orders)
      console.log('🔍 [DEBUG] Total count:', totalCount)

      // Buscar dados dos clientes separadamente
      if (orders.length > 0) {
        const customerIds = orders.map(order => order.customer_id).filter(Boolean)
        
        if (customerIds.length > 0) {
          const { data: customersData } = await supabase
            .from('crm_customer')
            .select('customer_id, name')
            .eq('tenant_id', tenant_id)
            .in('customer_id', customerIds)
          
          if (customersData) {
            const customerMap = new Map(customersData.map(c => [c.customer_id, c.name]))
            
            // Associar nomes dos clientes aos pedidos
            orders = orders.map(order => ({
              ...order,
              crm_customer: customerMap.has(order.customer_id) 
                ? [{ name: customerMap.get(order.customer_id)! }]
                : []
            }))
          }
        }
      }
    }

    // RLS decide acesso aos dados

  } catch (error) {
    console.error('Error loading sales orders:', error)
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

  const getStatusActions = (status: string, soId: string) => {
    return <StatusActionButtons soId={soId} currentStatus={status} />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fiori-primary">Pedidos de Venda</h1>
          <p className="text-fiori-secondary mt-2">
            {totalCount} pedido{totalCount !== 1 ? 's' : ''} cadastrado{totalCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/sd" className="btn-fiori-outline">
            Voltar para SD
          </Link>
          <Link href="/sd/orders/new" className="btn-fiori-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Pedido
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
                  placeholder="Nº pedido, cliente..."
                  className="input-fiori pl-10"
                />
              </div>
            </div>
            <div>
              <label className="label-fiori">Status</label>
              <select className="select-fiori">
                <option value="">Todos</option>
                <option value="draft">Rascunho</option>
                <option value="approved">Aprovado</option>
                <option value="invoiced">Faturado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="label-fiori">Cliente</label>
              <input
                type="text"
                placeholder="Nome do cliente..."
                className="input-fiori"
              />
            </div>
            <div>
              <label className="label-fiori">Data Inicial</label>
              <input
                type="date"
                className="input-fiori"
              />
            </div>
            <div>
              <label className="label-fiori">Data Final</label>
              <input
                type="date"
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

      {/* Tabela de Pedidos */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Lista de Pedidos</h3>
        </div>
        <div className="card-fiori-content p-0">
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-fiori">
                <thead>
                  <tr>
                    <th>Nº Pedido</th>
                    <th>Cliente</th>
                    <th>Data</th>
                    <th>Valor Total (R$)</th>
                    <th>Valor Negociado (R$)</th>
                    <th>Forma de Pagamento</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {(orders ?? []).map((order) => (
                    <tr key={order.so_id}>
                      <td>
                        <span className="font-mono text-sm text-fiori-primary">
                          {order.doc_no || order.so_id}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div className="font-semibold text-fiori-primary">
                            {order.crm_customer?.[0]?.name || 'Cliente não encontrado'}
                          </div>
                          <div className="text-xs text-fiori-muted">{order.customer_id}</div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {new Date(order.order_date).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm font-semibold">
                          {formatBRL((order.total_cents || 0))}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {order.total_negotiated_cents 
                            ? formatBRL(order.total_negotiated_cents)
                            : '-'
                          }
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {order.payment_method || order.payment_term || '-'}
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(order.status)}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/sd/orders/${order.so_id}`}
                            className="btn-fiori-outline text-xs flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            Ver
                          </Link>
                          {getStatusActions(order.status, order.so_id)}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-semibold text-fiori-primary mb-2">Nenhum pedido encontrado</h3>
              <p className="text-fiori-muted mb-4">Comece criando seu primeiro pedido de venda</p>
              <Link href="/sd/orders/new" className="btn-fiori-primary">
                Criar Pedido
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Paginação */}
      {orders.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-fiori-muted">
            Mostrando 1-{orders.length} de {totalCount} pedidos
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



