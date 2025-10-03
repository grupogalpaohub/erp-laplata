import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = supabaseServer()
  const tenantId = await requireTenantId()

  // Buscar dados básicos para o dashboard
  const { data: materials } = await supabase
    .from('mm_material')
    .select('mm_material, mm_desc, mm_price_cents')
    .limit(5)

  const { data: customers } = await supabase
    .from('crm_customer')
    .select('customer_id, name, email')
    .limit(5)

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Visão geral do sistema ERP</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card de Materiais */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Materiais Recentes</h3>
          <div className="space-y-3">
            {materials?.map((material) => (
              <div key={material.mm_material} className="flex justify-between items-center">
                <div>
                  <p className="text-white text-sm">{material.mm_desc}</p>
                  <p className="text-gray-400 text-xs">{material.mm_material}</p>
                </div>
                <p className="text-green-400 text-sm">
                  R$ {(material.mm_price_cents / 100).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Card de Clientes */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Clientes Recentes</h3>
          <div className="space-y-3">
            {customers?.map((customer) => (
              <div key={customer.customer_id} className="flex justify-between items-center">
                <div>
                  <p className="text-white text-sm">{customer.name}</p>
                  <p className="text-gray-400 text-xs">{customer.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card de Estatísticas */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Estatísticas</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Total de Materiais:</span>
              <span className="text-white">{materials?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total de Clientes:</span>
              <span className="text-white">{customers?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tenant:</span>
              <span className="text-white">{tenantId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
