export const dynamic = 'force-dynamic'
export const revalidate = 0
import { supabaseServer } from '@/src/lib/supabase/server'

async function getInventory() {
  const supabase = supabaseServer()
  const tenantId = 'LaplataLunaria'

  try {
    const { data, error } = await supabase
      .from('wh_inventory_balance')
      .select(`
        plant_id,
        mm_material,
        on_hand_qty,
        reserved_qty,
        last_count_date,
        status
      `)
      .eq('tenant_id', tenantId)
      .order('mm_material')

    if (error) {
      console.error('Error fetching inventory:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return []
  }
}

export default async function InventoryPage() {
  const inventory = await getInventory()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventário</h1>
        <p className="mt-1 text-sm text-gray-500">
          Saldos atuais de materiais em estoque
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Saldos de Estoque</h3>
        </div>
        
        {inventory.length === 0 ? (
          <div className="px-6 py-4 text-center text-gray-500">
            Nenhum item encontrado no inventário
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {inventory.map((item, index) => (
              <li key={`${item.plant_id}-${item.mm_material}`} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.mm_material}
                      </p>
                      <span className="text-sm text-gray-500">
                        Depósito: {item.plant_id}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Última contagem: {item.last_count_date ? new Date(item.last_count_date).toLocaleDateString('pt-BR') : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {item.on_hand_qty} unidades
                      </p>
                      <p className="text-xs text-gray-500">Disponível</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {item.reserved_qty} unidades
                      </p>
                      <p className="text-xs text-gray-500">Reservado</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {item.on_hand_qty - item.reserved_qty} unidades
                      </p>
                      <p className="text-xs text-gray-500">Livre</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}