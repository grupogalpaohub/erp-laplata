import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'
import { ArrowLeft } from 'lucide-react'
import EditSalesOrderForm from './EditSalesOrderForm'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface EditSalesOrderPageProps {
  params: { so_id: string }
}

export default async function EditSalesOrderPage({ params }: EditSalesOrderPageProps) {
  const soId = params.so_id
  let order: any = null
  let customers: any[] = []
  let materials: any[] = []
  let paymentTerms: any[] = []

  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    // Buscar pedido específico (usar apenas campos existentes)
    const { data: orderData, error: orderError } = await supabase
      .from('sd_sales_order')
      .select(`
        so_id,
        customer_id,
        status,
        order_date,
        expected_ship,
        total_cents,
        created_at,
        crm_customer(name)
      `)
      .eq('tenant_id', tenantId)
      .eq('so_id', soId)
      .single()

    if (orderError) {
      console.error('Error fetching order:', orderError)
    } else {
      order = orderData
    }

    // Buscar dados necessários para o formulário
    const [customersResult, materialsResult, paymentTermsResult] = await Promise.allSettled([
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
        .order('mm_material'),
      supabase
        .from('fi_payment_terms_def')
        .select('terms_code, description, days')
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .order('terms_code')
    ])

    if (customersResult.status === 'fulfilled') {
      customers = customersResult.value.data || []
    }
    if (materialsResult.status === 'fulfilled') {
      materials = materialsResult.value.data || []
    }
    if (paymentTermsResult.status === 'fulfilled') {
      paymentTerms = paymentTermsResult.value.data || []
    }

  } catch (error) {
    console.error('Error in edit order page:', error)
  }

  if (!order) {
    return (
      <div className="container-fiori">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-fiori-text-primary mb-4">
            Pedido não encontrado
          </h1>
          <p className="text-fiori-text-secondary mb-6">
            O pedido {soId} não foi encontrado ou você não tem permissão para acessá-lo.
          </p>
          <Link
            href="/sd/orders"
            className="btn-fiori"
          >
            Voltar para Pedidos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fiori">
      <div className="mb-6">
        <Link 
          href="/sd/orders" 
          className="btn-fiori-outline inline-flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Pedidos
        </Link>
        <h1 className="text-3xl font-bold text-fiori-text-primary">
          Editar Pedido {order.so_id}
        </h1>
        <p className="text-fiori-text-secondary mt-2">
          Editar informações do pedido de venda
        </p>
      </div>

      <EditSalesOrderForm 
        order={order}
        customers={customers}
        materials={materials}
        paymentTerms={paymentTerms}
      />
    </div>
  )
}
