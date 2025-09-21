import Link from 'next/link'
import { supabaseServer } from '@/src/lib/supabaseServer'
import { getTenantId } from '@/src/lib/auth'
import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react'
import NewSalesOrderForm from './NewSalesOrderForm'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function NewSalesOrderPage() {
  let customers = []
  let materials = []
  let paymentTerms = []

  try {
    const supabase = supabaseServer()
    const tenantId = await getTenantId()

    // Buscar dados necessários
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
        .order('mm_comercial'),
      supabase
        .from('fi_payment_terms_def')
        .select('terms_code, description')
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .order('description')
    ])

    customers = customersResult.status === 'fulfilled' ? (customersResult.value.data || []) : []
    materials = materialsResult.status === 'fulfilled' ? (materialsResult.value.data || []) : []
    paymentTerms = paymentTermsResult.status === 'fulfilled' ? (paymentTermsResult.value.data || []) : []

  } catch (error) {
    console.error('Error loading data for new sales order:', error)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/sd/orders" className="btn-fiori-outline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-fiori-primary">Novo Pedido de Venda</h1>
            <p className="text-fiori-secondary mt-2">Criar novo pedido de venda no sistema</p>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <NewSalesOrderForm 
        customers={customers}
        materials={materials}
        paymentTerms={paymentTerms}
      />
    </div>
  )
}