import { supabaseServer } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Eye, Calendar, DollarSign, User } from 'lucide-react'

async function PurchasesList() {
  const supabase = supabaseServer()

  // Buscar pedidos de compra
  const { data: orders, error } = await supabase
    .from('mm_purchase_order')
    .select('*')
    .eq('tenant_id', 'LaplataLunaria')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar pedidos:', error)
  }

  // Buscar fornecedores separadamente
  const { data: vendors } = await supabase
    .from('mm_vendor')
    .select('vendor_id, vendor_name, email, telefone')
    .eq('tenant_id', 'LaplataLunaria')

  // Fazer join manual
  const ordersWithVendors = orders?.map(order => ({
    ...order,
    mm_vendor: vendors?.find(v => v.vendor_id === order.vendor_id) || null
  })) || []

  const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string | null | undefined) => {
    switch (status) {
      case 'draft': return 'Rascunho'
      case 'confirmed': return 'Confirmado'
      case 'shipped': return 'Enviado'
      case 'cancelled': return 'Cancelado'
      default: return 'Rascunho'
    }
  }

  const formatBRL = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pedidos de Compra</h1>
          <p className="text-gray-600 mt-2">Gerencie todos os pedidos de compra</p>
        </div>
        <Link
          href="/mm/purchases/new"
          className="btn-fiori-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Novo Pedido
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        {ordersWithVendors.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              Comece criando seu primeiro pedido de compra
            </p>
            <Link
              href="/mm/purchases/new"
              className="btn-fiori-primary"
            >
              Criar Primeiro Pedido
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {ordersWithVendors.map((order) => (
              <div key={order.mm_order} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {order.mm_order}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {order.mm_vendor?.vendor_name || 'Fornecedor não encontrado'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.po_date || order.created_at).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {formatBRL(order.total_cents || order.total_amount || 0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <Link
                      href={`/mm/purchases/${order.mm_order}`}
                      className="btn-fiori-outline flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalhes
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PurchasesList
