import Link from 'next/link'
import { createClient } from '@/src/lib/supabase/server'
import { getTenantId } from '@/src/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const supabase = createClient()
  const tenantId = await getTenantId()

  // Buscar dados para KPIs
  const { data: materials } = await supabase
    .from('mm_material')
    .select('mm_material, mm_comercial, purchase_price_cents, sale_price_cents')
    .eq('tenant_id', tenantId)
    .limit(5)

  const { data: vendors } = await supabase
    .from('mm_vendor')
    .select('vendor_id, vendor_name')
    .eq('tenant_id', tenantId)
    .limit(5)

  const { data: orders } = await supabase
    .from('mm_purchase_order')
    .select('mm_order, vendor_id, total_amount_cents, status')
    .eq('tenant_id', tenantId)
    .limit(5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">ERP LaPlata</h1>
        <p className="text-xl text-fiori-secondary mb-2">Sistema de Gestão Empresarial</p>
        <p className="text-lg text-fiori-muted">Selecione um módulo para começar</p>
      </div>

      {/* Módulos */}
      <div className="grid-fiori-4">
        <Link href="/mm" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Materiais (MM)</h3>
            <p className="tile-fiori-subtitle">Materiais, compras, fornecedores</p>
          </div>
        </Link>

        <Link href="/sd" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Vendas (SD)</h3>
            <p className="tile-fiori-subtitle">Pedidos, clientes, faturas</p>
          </div>
        </Link>

        <Link href="/wh" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Estoque (WH)</h3>
            <p className="tile-fiori-subtitle">Inventário e movimentações</p>
          </div>
        </Link>

        <Link href="/co" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Controle (CO)</h3>
            <p className="tile-fiori-subtitle">Relatórios e custos</p>
          </div>
        </Link>

        <Link href="/crm" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">CRM</h3>
            <p className="tile-fiori-subtitle">Clientes e oportunidades</p>
          </div>
        </Link>

        <Link href="/fi" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Financeiro</h3>
            <p className="tile-fiori-subtitle">Contas a pagar e receber</p>
          </div>
        </Link>

        <Link href="/analytics" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Analytics</h3>
            <p className="tile-fiori-subtitle">Relatórios e dashboards</p>
          </div>
        </Link>

        <Link href="/setup" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Configurações</h3>
            <p className="tile-fiori-subtitle">Setup e customização</p>
          </div>
        </Link>
      </div>

      {/* KPIs Section - EXATAMENTE como SAP Fiori */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-fiori-primary mb-6">Visão Geral</h2>
        <div className="grid-fiori-6">
          {/* KPI 1 - Total de Materiais (Verde - Bom) */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Total de Materiais</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-success">{materials?.length || 0}</div>
            <p className="tile-fiori-metric-label">Itens cadastrados</p>
          </div>

          {/* KPI 2 - Fornecedores (Verde - Bom) */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Fornecedores</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-success">{vendors?.length || 0}</div>
            <p className="tile-fiori-metric-label">Fornecedores ativos</p>
          </div>

          {/* KPI 3 - Pedidos de Compra (Neutro) */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Pedidos de Compra</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-neutral">{orders?.length || 0}</div>
            <p className="tile-fiori-metric-label">Pedidos em andamento</p>
          </div>

          {/* KPI 4 - Materiais sem Fornecedor (Vermelho - Ruim) */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Materiais sem Fornecedor</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-danger">0</div>
            <p className="tile-fiori-metric-label">Requer atenção</p>
          </div>

          {/* KPI 5 - Variação de Preços (Amarelo - Atenção) */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Variação de Preços</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-warning">12.5%</div>
            <p className="tile-fiori-metric-label">Últimos 30 dias</p>
          </div>

          {/* KPI 6 - Eficiência de Compras (Verde - Bom) */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Eficiência de Compras</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-success">98.2%</div>
            <p className="tile-fiori-metric-label">Taxa de sucesso</p>
          </div>
        </div>
      </div>
    </div>
  )
}