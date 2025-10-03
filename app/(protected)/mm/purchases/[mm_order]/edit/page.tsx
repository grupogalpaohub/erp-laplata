import { requireSession } from '@/lib/auth/requireSession'
import { supabaseServerReadOnly } from '@/lib/supabase/server-readonly'
import EditPOClient from './EditPOClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface EditPurchaseOrderPageProps {
  params: { mm_order: string }
}

export default async function EditPurchaseOrderPage({ params }: EditPurchaseOrderPageProps) {
  await requireSession()

  const supabase = supabaseServerReadOnly()

  try {
    // Buscar dados do pedido
    const { data: orderData, error: orderError } = await supabase
      .from('mm_purchase_order')
      .select(`
        tenant_id, 
        mm_order, 
        vendor_id, 
        order_date, 
        expected_delivery, 
        status, 
        total_cents, 
        created_at, 
        notes
      `)
      .eq('mm_order', params.mm_order)
      .single()

    if (orderError || !orderData) {
      throw new Error('Pedido não encontrado')
    }

    // Buscar itens do pedido
    const { data: itemsData, error: itemsError } = await supabase
      .from('mm_purchase_order_item')
      .select(`
        po_item_id, 
        mm_order, 
        plant_id, 
        mm_material, 
        mm_qtt, 
        unit_cost_cents, 
        line_total_cents, 
        currency,
        mm_material_data:mm_material(mm_comercial, mm_desc)
      `)
      .eq('mm_order', params.mm_order)
      .order('po_item_id', { ascending: true })

    if (itemsError) {
      console.error('Erro ao buscar itens:', itemsError)
    }

    // Buscar fornecedores
    const { data: vendors } = await supabase
      .from('mm_vendor')
      .select('vendor_id, vendor_name, email, telefone')
      // RLS filtra automaticamente por tenant_id

    // Buscar materiais
    const { data: materials } = await supabase
      .from('mm_material')
      .select('mm_material, mm_comercial, mm_desc, mm_purchase_price_cents')
      // RLS filtra automaticamente por tenant_id
      .eq('status', 'active')

    return (
      <EditPOClient 
        orderData={orderData}
        itemsData={itemsData || []}
        vendors={vendors || []}
        materials={materials || []}
      />
    )

  } catch (error) {
    console.error('Erro ao carregar dados para edição:', error)
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Erro ao carregar pedido</h1>
          <p className="text-gray-300 mb-6">Não foi possível carregar os dados do pedido para edição.</p>
          <a 
            href="/mm/purchases" 
            className="btn-fiori-primary"
          >
            Voltar para Lista
          </a>
        </div>
      </div>
    )
  }
}
