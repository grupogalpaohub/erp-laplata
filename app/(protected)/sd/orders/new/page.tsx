import Link from 'next/link'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth/requireSession'
import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react'
import NewSalesOrderForm from './NewSalesOrderForm'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface NewSalesOrderPageProps {
  searchParams: { customerId?: string }
}

export default async function NewSalesOrderPage({ searchParams }: NewSalesOrderPageProps) {
  const selectedCustomerId = searchParams.customerId
  let customers: any[] = []
  let materials: any[] = []
  let paymentTerms: any[] = []

  try {
    const supabase = getSupabaseServerClient()
    await requireSession()

    // Buscar dados necessários
    const [customersResult, materialsResult, paymentTermsResult] = await Promise.allSettled([
      supabase
        .from('crm_customer')
        .select('customer_id, name, contact_email')
        
        .eq('is_active', true)
        .order('name'),
      supabase
        .from('mm_material')
        .select('mm_material, mm_comercial, mm_desc, mm_price_cents')
        
        .eq('status', 'active')
        .order('mm_comercial'),
      supabase
        .from('fi_payment_terms_def')
        .select('terms_code, description')
        
        .eq('is_active', true)
        .order('description')
    ])

    customers = customersResult.status === 'fulfilled' ? (customersResult.value.data || []) : []
    materials = materialsResult.status === 'fulfilled' ? (materialsResult.value.data || []) : []
    paymentTerms = paymentTermsResult.status === 'fulfilled' ? (paymentTermsResult.value.data || []) : []
    
    // Se não houver dados de formas de pagamento, usar dados padrão
    if (paymentTerms.length === 0) {
      paymentTerms = [
        { terms_code: 'A_VISTA', description: 'À Vista' },
        { terms_code: '30_DIAS', description: '30 Dias' },
        { terms_code: '60_DIAS', description: '60 Dias' },
        { terms_code: '90_DIAS', description: '90 Dias' },
        { terms_code: 'BOLETO', description: 'Boleto Bancário' },
        { terms_code: 'CARTAO_CREDITO', description: 'Cartão de Crédito' },
        { terms_code: 'CARTAO_DEBITO', description: 'Cartão de Débito' },
        { terms_code: 'PIX', description: 'PIX' },
        { terms_code: 'TRANSFERENCIA', description: 'Transferência Bancária' },
        { terms_code: 'DINHEIRO', description: 'Dinheiro' }
      ]
    }

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
        selectedCustomerId={selectedCustomerId}
      />
    </div>
  )
}

