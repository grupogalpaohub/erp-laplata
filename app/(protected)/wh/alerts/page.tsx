import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'
import { redirect } from 'next/navigation'
import { LowStockAlert } from '@/lib/schemas/wh'

export default async function AlertsPage() {
  const supabase = supabaseServer()
  
  try {
    const tenantId = await requireTenantId()
    
    const { data: alerts, error } = await supabase
      .from('wh_low_stock_alert')
      .select(`
        *,
        mm_material:mm_material(material_name, category, classification),
        wh_warehouse:plant_id(plant_name, address)
      `)
      .eq('tenant_id', tenantId)
      .order('alert_date', { ascending: false })

    if (error) {
      console.error('Error loading alerts:', error)
      redirect('/wh')
    }

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'active':
          return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        case 'resolved':
          return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        case 'dismissed':
          return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      }
    }

    const getStatusText = (status: string) => {
      switch (status) {
        case 'active':
          return 'Ativo'
        case 'resolved':
          return 'Resolvido'
        case 'dismissed':
          return 'Dispensado'
        default:
          return 'Desconhecido'
      }
    }

    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Alertas de Estoque
          </h1>
        </div>

        {/* Alerts Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Armazém
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Qtd Atual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Qtd Mínima
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data Alerta
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {alerts?.map((alert: LowStockAlert & { 
                  mm_material?: any, 
                  wh_warehouse?: any 
                }) => (
                  <tr key={alert.alert_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {alert.mm_material?.material_name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {alert.mm_material?.category || 'N/A'} - {alert.mm_material?.classification || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {alert.wh_warehouse?.plant_name || alert.plant_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        alert.current_qty < alert.min_qty 
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {alert.current_qty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {alert.min_qty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(alert.status)}`}>
                        {getStatusText(alert.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(alert.alert_date).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {(!alerts || alerts.length === 0) && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum alerta encontrado</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Os alertas de estoque baixo aparecerão aqui quando necessário.
            </p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error loading alerts page:', error)
    redirect('/login')
  }
}
