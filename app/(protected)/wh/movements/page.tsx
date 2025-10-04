import { supabaseServerReadOnly } from '@/lib/supabase/server-readonly'
import { requireTenantId } from '@/utils/tenant'
import { redirect } from 'next/navigation'
import { InventoryLedger } from '@/lib/schemas/wh'

export const dynamic = 'force-dynamic';

export default async function MovementsPage() {
  const supabase = supabaseServerReadOnly()
  
  try {
    const tenantId = await requireTenantId()
    
    const { data: movements, error } = await supabase
      .from('wh_inventory_ledger')
      .select(`
        *,
        mm_material:mm_material(mm_desc, mm_mat_class, mm_mat_type),
        wh_warehouse:plant_id(name, address)
      `)
      .eq('tenant_id', tenantId)
      .order('ledger_id', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error loading movements:', error)
      redirect('/wh')
    }

    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Movimentos de Estoque
          </h1>
        </div>

        {/* Movements Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Armazém
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Referência
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {movements?.map((movement: InventoryLedger & { 
                  mm_material?: any, 
                  wh_warehouse?: any 
                }) => (
                  <tr key={movement.ledger_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {movement.ledger_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {movement.mm_material?.mm_desc || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {movement.mm_material?.category || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {movement.wh_warehouse?.name || movement.plant_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        movement.movement_type === 'IN' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : movement.movement_type === 'OUT'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {movement.movement_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        movement.qty > 0 
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {movement.qty > 0 ? '+' : ''}{movement.qty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {movement.reference_type && movement.reference_id 
                        ? `${movement.reference_type}: ${movement.reference_id}`
                        : '-'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {(!movements || movements.length === 0) && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum movimento encontrado</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Os movimentos de estoque aparecerão aqui quando houver movimentações.
            </p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error loading movements page:', error)
    redirect('/login')
  }
}