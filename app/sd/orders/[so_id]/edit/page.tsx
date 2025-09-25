import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'
import { formatCurrency } from '@/lib/currency'
import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react'
import EditSalesOrderForm from './EditSalesOrderForm'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface SalesOrder {
  so_id: string
  doc_no?: string
  customer_id: string
  status: string
  order_date: string
  expected_ship?: string
  total_cents: number
  total_final_cents?: number
  total_negotiated_cents?: number
  payment_method?: string
  payment_term?: string
  notes?: string
  created_at: string
  crm_customer: {
    name: string
  }[]
}

export default async function EditSalesOrderPage({ params }: { params: { so_id: string } }) {
  const { so_id } = params
  let order: SalesOrder | null = null
  let customers: any[] = []
  let materials: any[] = []
  let error = ''

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const tenantId = await getTenantId()

    // Buscar pedido
    const { data: orderData, error: orderError } = await supabase
      .from('sd_sales_order')
      .select(`
        so_id,
        doc_no,
        customer_id,
        status,
        order_date,
        expected_ship,
        total_cents,
        total_final_cents,
        total_negotiated_cents,
        payment_method,
        payment_term,
        notes,
        created_at,
        crm_customer(name)
      `)
      .eq('tenant_id', tenantId)
      .eq('so_id', so_id)
      .single()

    if (orderError) {
      error = orderError.message
    } else {
      order = orderData

      // Buscar dados necessários
      const [customersResult, materialsResult] = await Promise.allSettled([
        supabase
          .from('crm_customer')
          .select('customer_id, name, contact_email')
          .eq('tenant_id', tenantId)
          .eq('is_active', true)
          .order('name'),
        supabase
          .from('mm_material')
          .select('mm_material, mm_comercial, mm_desc, mm_price_cents')
          .eq('tenant_id', tenantId)
          .eq('status', 'active')
          .order('mm_comercial')
      ])

      customers = customersResult.status === 'fulfilled' ? (customersResult.value.data || []) : []
      materials = materialsResult.status === 'fulfilled' ? (materialsResult.value.data || []) : []
    }
  } catch (err) {
    console.error('Error loading sales order:', err)
    error = 'Erro ao carregar pedido'
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card-fiori">
          <div className="card-fiori-content text-center">
            <h1 className="text-2xl font-bold text-fiori-text mb-4">Pedido não encontrado</h1>
            <p className="text-fiori-muted mb-6">{error}</p>
            <Link href="/sd/orders" className="btn-fiori">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Pedidos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (order.status !== 'draft') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card-fiori">
          <div className="card-fiori-content text-center">
            <h1 className="text-2xl font-bold text-fiori-text mb-4">Pedido não pode ser editado</h1>
            <p className="text-fiori-muted mb-6">
              Apenas pedidos com status "Rascunho" podem ser editados.
            </p>
            <Link href={`/sd/orders/${so_id}`} className="btn-fiori">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ver Pedido
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href={`/sd/orders/${so_id}`} className="btn-fiori-outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-fiori-text">
              Editar Pedido {order.doc_no || order.so_id}
            </h1>
            <p className="text-fiori-muted">
              Cliente: {order.crm_customer?.[0]?.name || 'Não encontrado'}
            </p>
          </div>
        </div>
      </div>

      {/* Formulário de Edição */}
      <EditSalesOrderForm 
        order={order}
        customers={customers}
        materials={materials}
      />
    </div>
  )
}