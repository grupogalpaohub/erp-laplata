import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { supabaseServer } from '@/src/lib/supabaseServer'
import { getTenantId } from '@/src/lib/auth'

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

  try {
    const supabase = supabaseServer()
    const tenantId = await getTenantId()

    // Buscar dados para KPIs
    const [materialsResult, vendorsResult, ordersResult] = await Promise.allSettled([
      supabase
        .from('mm_material')
        .select('mm_material, mm_comercial, purchase_price_cents, sale_price_cents')
        .eq('tenant_id', tenantId),
      supabase
        .from('mm_vendor')
        .select('vendor_id, vendor_name, is_active')
        .eq('tenant_id', tenantId),
      supabase
        .from('mm_purchase_order')
        .select('mm_order, total_amount_cents, status')
        .eq('tenant_id', tenantId)
    ])

    materials = materialsResult.status === 'fulfilled' ? (materialsResult.value.data || []) : []
    vendors = vendorsResult.status === 'fulfilled' ? (vendorsResult.value.data || []) : []
    purchaseOrders = ordersResult.status === 'fulfilled' ? (ordersResult.value.data || []) : []

    // Calcular KPIs
    totalMaterials = materials.length
    totalVendors = vendors.filter(v => v.is_active).length
    totalOrders = purchaseOrders.length
    totalValue = purchaseOrders.reduce((sum, order) => sum + (order.total_amount_cents || 0), 0)

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
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">Materiais (MM)</h1>
          <p className="text-xl text-fiori-secondary mb-2">Gestão de Materiais e Compras</p>
          <p className="text-lg text-fiori-muted">Selecione uma funcionalidade para começar</p>
        </div>
        <div className="w-20"></div> {/* Spacer para centralizar */}
      </div>

      {/* KPIs Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-fiori-primary mb-6">Visão Geral</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* KPI 1 - Total de Materiais */}
          <div className="card-fiori">
            <div className="card-fiori-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-fiori-muted">Total de Materiais</p>
                  <p className="text-2xl font-bold text-fiori-primary">{totalMaterials}</p>
                </div>
                <svg className="w-8 h-8 text-fiori-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          {/* KPI 2 - Fornecedores Ativos */}
          <div className="card-fiori">
            <div className="card-fiori-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-fiori-muted">Fornecedores Ativos</p>
                  <p className="text-2xl font-bold text-fiori-success">{totalVendors}</p>
                </div>
                <svg className="w-8 h-8 text-fiori-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          {/* KPI 3 - Pedidos de Compra */}
          <div className="card-fiori">
            <div className="card-fiori-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-fiori-muted">Pedidos de Compra</p>
                  <p className="text-2xl font-bold text-fiori-info">{totalOrders}</p>
                </div>
                <svg className="w-8 h-8 text-fiori-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          {/* KPI 4 - Valor Total em Compras */}
          <div className="card-fiori">
            <div className="card-fiori-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-fiori-muted">Valor Total em Compras</p>
                  <p className="text-2xl font-bold text-fiori-warning">R$ {(totalValue / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <svg className="w-8 h-8 text-fiori-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Módulos */}
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

        <Link href="/mm/materials/bulk-edit" className="group">
          <div className="tile-fiori">
            <div className="tile-fiori-icon">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="tile-fiori-title">Edição de Materiais</h3>
            <p className="tile-fiori-subtitle">Editar múltiplos materiais</p>
          </div>
        </Link>
      </div>
    </div>
  )
}