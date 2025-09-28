import { requireSession } from '@/lib/auth/requireSession'
import Link from 'next/link'
import { ArrowLeft, Printer, Edit } from 'lucide-react'

interface PurchaseOrderData {
  tenant_id: string
  mm_order: string
  vendor_id: string
  order_date: string
  expected_delivery?: string
  total_cents: number
  status: string
  notes?: string
  vendor?: {
    vendor_id: string
    vendor_name: string
    email?: string
  }
  items?: Array<{
    row_no: number
    mm_material: string
    mm_qtt: number
    unit_cost_cents: number
    line_total_cents: number
    material?: {
      mm_desc: string
      commercial_name?: string
    }
  }>
}

async function getPurchaseOrderData(mm_order: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/mm/purchase-orders/${mm_order}`, {
      cache: 'no-store'
    })
    
    const result = await response.json()
    
    if (!result.ok) {
      return { error: result.error, data: null }
    }
    
    return { error: null, data: result.data }
  } catch (error) {
    console.error('Error fetching purchase order:', error)
    return { 
      error: { code: 'FETCH_ERROR', message: 'Erro ao buscar pedido de compra' }, 
      data: null 
    }
  }
}

export default async function PurchaseOrderDetailPage({ 
  params 
}: { 
  params: { mm_order: string } 
}) {
  await requireSession()
  
  const { error, data: po } = await getPurchaseOrderData(params.mm_order)

  // Renderizar mensagem de erro só se ok:false && error.code==='NOT_FOUND'
  if (error && error.code === 'PO_NOT_FOUND') {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h1 className="text-xl font-semibold text-red-800 mb-2">
            Pedido não encontrado
          </h1>
          <p className="text-red-600 mb-4">
            O pedido de compra {params.mm_order} não foi encontrado.
          </p>
          <Link 
            href="/mm/purchases" 
            className="btn-fiori-primary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para lista
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h1 className="text-xl font-semibold text-yellow-800 mb-2">
            Erro ao carregar pedido
          </h1>
          <p className="text-yellow-600 mb-4">
            {error.message}
          </p>
          <Link 
            href="/mm/purchases" 
            className="btn-fiori-primary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para lista
          </Link>
        </div>
      </div>
    )
  }

  if (!po) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <h1 className="text-xl font-semibold text-gray-800 mb-2">
            Carregando...
          </h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/mm/purchases" 
            className="btn-fiori-outline flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pedido de Compra {po.mm_order}
            </h1>
            <p className="text-gray-600">
              {po.vendor?.vendor_name || po.vendor_id}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-fiori-outline flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <Link 
            href={`/mm/purchases/${po.mm_order}/edit`}
            className="btn-fiori-primary flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar
          </Link>
        </div>
      </div>

      {/* PO Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Informações do Pedido</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-600">Número:</span>
              <span className="ml-2 font-mono">{po.mm_order}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Data:</span>
              <span className="ml-2">{new Date(po.order_date).toLocaleDateString('pt-BR')}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                po.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                po.status === 'approved' ? 'bg-green-100 text-green-800' :
                po.status === 'invoiced' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {po.status}
              </span>
            </div>
            {po.expected_delivery && (
              <div>
                <span className="text-sm text-gray-600">Entrega prevista:</span>
                <span className="ml-2">{new Date(po.expected_delivery).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Fornecedor</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-600">Nome:</span>
              <span className="ml-2">{po.vendor?.vendor_name || po.vendor_id}</span>
            </div>
            {po.vendor?.email && (
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <span className="ml-2">{po.vendor.email}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Valores</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total:</span>
              <span className="font-semibold">
                R$ {(po.total_cents / 100).toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Itens:</span>
              <span className="ml-2">{po.items?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-900">Itens do Pedido</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qtd
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço Unit.
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(po.items ?? []).map((item) => (
                <tr key={item.row_no}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.row_no}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.mm_material}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.material?.mm_desc || 'Sem descrição'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {item.mm_qtt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    R$ {(item.unit_cost_cents / 100).toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    R$ {(item.line_total_cents / 100).toFixed(2).replace('.', ',')}
                  </td>
                </tr>
              ))}
              {(!po.items || po.items.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nenhum item encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      {po.notes && (
        <div className="mt-6 bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Observações</h3>
          <p className="text-gray-700">{po.notes}</p>
        </div>
      )}
    </div>
  )
}