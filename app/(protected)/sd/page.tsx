import Link from 'next/link'
import { requireSession } from '@/lib/auth/requireSession'
import { getServerSupabase } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import { formatBRL } from '@/lib/money'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function SDPage() {
  let salesOrders: any[] = []
  let customers: any[] = []
  let totalOrders = 0
  let totalValue = 0

  try {
    await requireSession() // Verificar se está autenticado
    const supabase = getServerSupabase()

    // Buscar dados para KPIs (RLS filtra automaticamente por tenant)
    const [ordersResult, customersResult, totalOrdersResult, totalValueResult] = await Promise.allSettled([
      supabase
        .from('sd_sales_order')
        .select(`
          so_id,
          doc_no,
          customer_id,
          status,
          order_date,
          total_final_cents,
          total_negotiated_cents,
          crm_customer!inner(name)
        `)
        .order('order_date', { ascending: false })
        .limit(5),
      supabase
        .from('crm_customer')
        .select('customer_id, name')
        .eq('is_active', true)
        .limit(5),
      supabase
        .from('sd_sales_order')
        .select('so_id', { count: 'exact' }),
      supabase
        .from('sd_sales_order')
        .select('total_final_cents')
    ])

    salesOrders = ordersResult.status === 'fulfilled' ? (ordersResult.value.data || []) : []
    customers = customersResult.status === 'fulfilled' ? (customersResult.value.data || []) : []
    totalOrders = totalOrdersResult.status === 'fulfilled' ? (totalOrdersResult.value.count || 0) : 0
    
    if (totalValueResult.status === 'fulfilled') {
      const orders = totalValueResult.value.data || []
      totalValue = orders.reduce((sum, order) => sum + (order.total_final_cents || 0), 0)
    }

  } catch (error) {
    console.error('Error loading SD data:', error)
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="btn-fiori-outline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">SD - Gestão de Vendas</h1>
          <p className="text-xl text-fiori-secondary mb-2">Pedidos de venda e gestão comercial</p>
          <p className="text-lg text-fiori-muted">Gerencie vendas e relacionamento com clientes</p>
        </div>
        <div className="w-20"></div> {/* Spacer para centralizar */}
      </div>

      {/* Tiles Principais */}
      <div className="grid-fiori-3">
        <Link href="/sd/orders/new" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Criar Pedido de Venda</h3>
            <p className="tile-fiori-subtitle">Novo pedido de venda</p>
          </div>
        </Link>

        <Link href="/sd/orders" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Pedidos de Venda</h3>
            <p className="tile-fiori-subtitle">Listar e gerenciar pedidos</p>
          </div>
        </Link>

        <Link href="/crm/customers" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Central de Clientes</h3>
            <p className="tile-fiori-subtitle">Gerenciar clientes</p>
          </div>
        </Link>
      </div>

      {/* KPIs Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-fiori-primary mb-6">Visão Geral</h2>
        <div className="grid-fiori-4">
          {/* KPI 1 - Total de Pedidos */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Total de Pedidos</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-success">{totalOrders}</div>
            <p className="tile-fiori-metric-label">Pedidos cadastrados</p>
          </div>

          {/* KPI 2 - Valor Total */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Valor Total</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-success">
              {formatBRL(totalValue)}
            </div>
            <p className="tile-fiori-metric-label">Valor total em vendas</p>
          </div>

          {/* KPI 3 - Pedidos Aprovados */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Pedidos Aprovados</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-success">
              {salesOrders.filter(order => order.status === 'approved').length}
            </div>
            <p className="tile-fiori-metric-label">Pedidos aprovados</p>
          </div>

          {/* KPI 4 - Ticket Médio */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Ticket Médio</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-neutral">
              {totalOrders > 0 ? formatBRL(Math.round(totalValue / totalOrders)) : formatBRL(0)}
            </div>
            <p className="tile-fiori-metric-label">Valor médio por pedido</p>
          </div>
        </div>
      </div>

      {/* Pedidos Recentes */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-fiori-primary mb-6">Pedidos Recentes</h2>
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Últimos Pedidos de Venda</h3>
            <Link href="/sd/orders" className="btn-fiori-outline text-sm">
              Ver Todos
            </Link>
          </div>
          <div className="card-fiori-content">
            {salesOrders.length > 0 ? (
              <div className="space-y-4">
                {salesOrders.map((order) => (
                  <div key={order.so_id} className="flex items-center justify-between p-4 border border-fiori-border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-fiori-primary/10 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-fiori-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-fiori-primary">
                          {order.doc_no || order.so_id}
                        </h4>
                        <p className="text-sm text-fiori-secondary">{order.crm_customer?.[0]?.name}</p>
                        <p className="text-xs text-fiori-muted">
                          {new Date(order.order_date).toLocaleDateString('pt-BR')} • 
                          {formatBRL((order.total_final_cents || 0))}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="mb-2">
                        {getStatusBadge(order.status)}
                      </div>
                      <Link 
                        href={`/sd/orders/${order.so_id}`}
                        className="btn-fiori-outline text-xs"
                      >
                        Ver Detalhes
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
                <p className="text-fiori-muted">Nenhum pedido de venda encontrado</p>
                <Link href="/sd/orders/new" className="btn-fiori-primary mt-4">
                  Criar Primeiro Pedido
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clientes Ativos */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-fiori-primary mb-6">Clientes Ativos</h2>
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Clientes com Pedidos</h3>
            <Link href="/crm/customers" className="btn-fiori-outline text-sm">
              Ver Todos
            </Link>
          </div>
          <div className="card-fiori-content">
            {customers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.map((customer) => (
                  <div key={customer.customer_id} className="p-4 border border-fiori-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-fiori-primary/10 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-fiori-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-fiori-primary">{customer.name}</h4>
                        <p className="text-sm text-fiori-muted">{customer.customer_id}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-fiori-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-fiori-muted">Nenhum cliente ativo encontrado</p>
                <Link href="/crm/customers/new" className="btn-fiori-primary mt-4">
                  Cadastrar Cliente
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

