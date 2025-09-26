import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { requireSession } from '@/lib/auth/requireSession'
import { formatBRL } from '@/lib/money'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function MMIndex() {
  let materials: any[] = []
  let vendors: any[] = []
  let purchaseOrders: any[] = []
  let totalMaterials = 0
  let totalVendors = 0
  let totalOrders = 0
  let totalValue = 0
  let monthlyValue = 0

  try {
    const { supabase } = await requireSession()

    // Buscar dados para KPIs (RLS filtra automaticamente por tenant)
    const [materialsResult, vendorsResult, ordersResult, monthlyOrdersResult] = await Promise.allSettled([
      supabase
        .from('mm_material')
        .select('mm_material, mm_comercial, mm_purchase_price_cents, mm_price_cents'),
      supabase
        .from('mm_vendor')
        .select('vendor_id, vendor_name, status'),
      supabase
        .from('mm_purchase_order')
        .select('mm_order, total_cents, status, po_date'),
      supabase
        .from('mm_purchase_order')
        .select('mm_order, total_cents, status, po_date')
        .gte('po_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
        .lte('po_date', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0])
    ])

    materials = materialsResult.status === 'fulfilled' ? (materialsResult.value.data || []) : []
    vendors = vendorsResult.status === 'fulfilled' ? (vendorsResult.value.data || []) : []
    purchaseOrders = ordersResult.status === 'fulfilled' ? (ordersResult.value.data || []) : []
    const monthlyOrders = monthlyOrdersResult.status === 'fulfilled' ? (monthlyOrdersResult.value.data || []) : []

    // Calcular KPIs
    totalMaterials = materials.length
    totalVendors = vendors.filter(v => v.status === 'active').length
    totalOrders = purchaseOrders.length
    totalValue = purchaseOrders.reduce((sum, order) => sum + (order.total_cents || 0), 0)
    monthlyValue = monthlyOrders.reduce((sum, order) => sum + (order.total_cents || 0), 0)

  } catch (error) {
    console.error('Error loading MM data:', error)
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
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">MM - Gestão de Materiais</h1>
          <p className="text-xl text-fiori-secondary mb-2">Materiais e compras</p>
          <p className="text-lg text-fiori-muted">Gerencie materiais e relacionamento com fornecedores</p>
        </div>
        <div className="w-20"></div> {/* Spacer para centralizar */}
      </div>

      {/* Tiles Principais */}
      <div className="grid-fiori-3">
        <Link href="/mm/materials/new" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Cadastro de Materiais</h3>
            <p className="tile-fiori-subtitle">Criar novo material</p>
          </div>
        </Link>

        <Link href="/mm/catalog" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Catálogo de Materiais</h3>
            <p className="tile-fiori-subtitle">Consulta com filtros e status</p>
          </div>
        </Link>

        <Link href="/mm/purchases/new" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Criar Pedido de Compras</h3>
            <p className="tile-fiori-subtitle">Gerar novo P.O.</p>
          </div>
        </Link>

        <Link href="/mm/purchases" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Pedidos de Compras</h3>
            <p className="tile-fiori-subtitle">Listagem e filtros</p>
          </div>
        </Link>

        <Link href="/mm/materials/bulk-import" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Importação em Massa</h3>
            <p className="tile-fiori-subtitle">Importar materiais via CSV</p>
          </div>
        </Link>


        <Link href="/mm/vendors/new" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Novo Fornecedor</h3>
            <p className="tile-fiori-subtitle">Cadastrar fornecedor</p>
          </div>
        </Link>

        <Link href="/mm/vendors" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Central de Fornecedores</h3>
            <p className="tile-fiori-subtitle">Gestão de fornecedores</p>
          </div>
        </Link>
      </div>

      {/* Visão Geral */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-fiori-primary mb-6">Visão Geral</h2>
        <div className="grid-fiori-5">
          {/* KPI 1 - Total de Materiais */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Total de Materiais</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-primary">{totalMaterials}</div>
            <p className="tile-fiori-metric-label">Materiais cadastrados</p>
          </div>

          {/* KPI 2 - Fornecedores Ativos */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Fornecedores Ativos</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-success">{totalVendors}</div>
            <p className="tile-fiori-metric-label">Fornecedores ativos</p>
          </div>

          {/* KPI 3 - Pedidos de Compra */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Pedidos de Compra</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-info">{totalOrders}</div>
            <p className="tile-fiori-metric-label">Pedidos de compra</p>
          </div>

          {/* KPI 4 - Valor Mensal em Compras */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Compras do Mês</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-warning">
              {formatBRL(monthlyValue)}
            </div>
            <p className="tile-fiori-metric-label">Valor do mês atual</p>
          </div>

          {/* KPI 5 - Valor Acumulado Total */}
          <div className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">Acumulado Total</h3>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="kpi-fiori kpi-fiori-info">
              {formatBRL(totalValue)}
            </div>
            <p className="tile-fiori-metric-label">Valor total histórico</p>
          </div>
        </div>
      </div>
    </div>
  )
}

