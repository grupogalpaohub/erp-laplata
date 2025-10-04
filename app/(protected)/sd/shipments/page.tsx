import { supabaseServerReadOnly } from '@/lib/supabase/server-readonly'
import { requireTenantId } from '@/utils/tenant'
import Link from 'next/link'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface Shipment {
  shipment_id: string
  so_id: string
  warehouse_id: string
  status: string
  ship_date: string | null
  created_at: string
  sd_sales_order: {
    customer_id: string
    order_date: string
    status: string
  }
  crm_customer: {
    name: string
    email: string
    telefone: string
  }
}

export default async function ShipmentsPage() {
  const supabase = supabaseServerReadOnly()
  
  try {
    const tenantId = await requireTenantId()
    
    // Buscar shipments com dados do cliente (sintaxe correta do PostgREST)
    const { data: shipments, error } = await supabase
      .from('sd_shipment')
      .select(`
        shipment_id,
        so_id,
        warehouse_id,
        status,
        ship_date,
        created_at,
        sd_sales_order:so_id(
          customer_id,
          order_date,
          status
        ),
        crm_customer:sd_sales_order!so_id(
          name,
          email,
          telefone
        )
      `)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading shipments:', error)
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Erro ao carregar expedições</h1>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Link 
              href="/sd" 
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Voltar para SD
            </Link>
          </div>
        </div>
      )
    }

    // Checagem defensiva para evitar erro de compilação
    const shipmentsData: Shipment[] = Array.isArray(shipments)
      ? (shipments as unknown as Shipment[])
      : []

    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Expedições</h1>
                <p className="text-gray-400 mt-2">
                  {shipmentsData.length} expedições cadastradas
                </p>
              </div>
              <Link 
                href="/sd" 
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Voltar para SD
              </Link>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pesquisar
                </label>
                <input
                  type="text"
                  placeholder="Nº expedição, pedido..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Todos</option>
                  <option value="allocated">Alocado</option>
                  <option value="shipped">Expedido</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data Inicial
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data Final
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Aplicar Filtros
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                Limpar
              </button>
            </div>
          </div>

          {/* Lista de Expedições */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Lista de Expedições</h2>
            </div>
            
            {shipmentsData.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-400">Nenhuma expedição encontrada</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Nº Expedição
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Pedido
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Data Criação
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Data Expedição
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {shipmentsData.map((shipment) => (
                      <tr key={shipment.shipment_id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {shipment.shipment_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          <Link 
                            href={`/sd/orders/${shipment.so_id}`}
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            {shipment.so_id}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {shipment.crm_customer?.name || 'Cliente não encontrado'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            shipment.status === 'allocated' 
                              ? 'bg-yellow-900 text-yellow-300' 
                              : shipment.status === 'shipped'
                              ? 'bg-green-900 text-green-300'
                              : 'bg-gray-900 text-gray-300'
                          }`}>
                            {shipment.status === 'allocated' ? 'Alocado' : 
                             shipment.status === 'shipped' ? 'Expedido' : 
                             shipment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {new Date(shipment.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {shipment.ship_date ? new Date(shipment.ship_date).toLocaleDateString('pt-BR') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          <div className="flex space-x-2">
                            <Link
                              href={`/sd/orders/${shipment.so_id}`}
                              className="text-blue-400 hover:text-blue-300 underline"
                            >
                              Ver Pedido
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Paginação */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Mostrando 1-{shipmentsData.length} de {shipmentsData.length} expedições
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading shipments page:', error)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Erro ao carregar expedições</h1>
          <p className="text-gray-400 mb-4">Erro interno do servidor</p>
          <Link 
            href="/sd" 
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Voltar para SD
          </Link>
        </div>
      </div>
    )
  }
}

