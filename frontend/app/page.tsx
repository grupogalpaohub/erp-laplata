import { supabaseServer } from '@/lib/supabase/server'
import Link from 'next/link'
import { Package, ShoppingCart, Warehouse, Plus } from 'lucide-react'

async function getKPIs() {
  const supabase = supabaseServer()
  const tenantId = 'LaplataLunaria'

  try {
    // KPI 1: Total de materiais
    const { count: materialsCount } = await supabase
      .from('mm_material')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)

    // KPI 2: Itens com saldo
    const { count: inventoryCount } = await supabase
      .from('wh_inventory_balance')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gt('on_hand_qty', 0)

    // KPI 3: Pedidos de venda
    const { count: salesOrdersCount } = await supabase
      .from('sd_sales_order')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)

    return {
      materialsCount: materialsCount || 0,
      inventoryCount: inventoryCount || 0,
      salesOrdersCount: salesOrdersCount || 0
    }
  } catch (error) {
    console.error('Error fetching KPIs:', error)
    return {
      materialsCount: 0,
      inventoryCount: 0,
      salesOrdersCount: 0
    }
  }
}

export default async function Home() {
  const kpis = await getKPIs()

  return (
    <div className="p-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Materiais</p>
              <p className="text-2xl font-semibold text-gray-900">{kpis.materialsCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Warehouse className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Itens com Saldo</p>
              <p className="text-2xl font-semibold text-gray-900">{kpis.inventoryCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingCart className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pedidos de Venda</p>
              <p className="text-2xl font-semibold text-gray-900">{kpis.salesOrdersCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Atalhos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/mm/materials/new"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <Plus className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Novo Material</h3>
              <p className="text-sm text-gray-500">Cadastrar material</p>
            </div>
          </div>
        </Link>

        <Link
          href="/mm/purchases/new"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <Plus className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Novo Pedido de Compra</h3>
              <p className="text-sm text-gray-500">Criar PO</p>
            </div>
          </div>
        </Link>

        <Link
          href="/sd/orders/new"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <Plus className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Nova Venda</h3>
              <p className="text-sm text-gray-500">Criar SO</p>
            </div>
          </div>
        </Link>

        <Link
          href="/mm/catalog"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <Package className="h-6 w-6 text-orange-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Catálogo</h3>
              <p className="text-sm text-gray-500">Ver materiais</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
