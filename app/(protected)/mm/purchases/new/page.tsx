import Link from 'next/link'
import { supabaseServer } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth/requireSession'
import { ArrowLeft } from 'lucide-react'
import NewPOClient from './NewPOClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface NewPurchaseOrderPageProps {
  searchParams: { vendorId?: string }
}

export default async function NewPurchaseOrderPage({ searchParams }: NewPurchaseOrderPageProps) {
  const selectedVendorId = searchParams.vendorId
  let vendors: any[] = []
  let materials: any[] = []

  try {
    const supabase = supabaseServer()
    
    // GUARDRAIL: Verificar autenticação via supabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      // Redirecionar para login se não autenticado
      return <div>Redirecionando para login...</div>
    }
    
    // RLS filtra automaticamente por tenant_id - não precisa derivar manualmente

    // Buscar dados necessários - RLS filtra automaticamente por tenant_id
    const [vendorsResult, materialsResult] = await Promise.allSettled([
      supabase
        .from('mm_vendor')
        .select('vendor_id, vendor_name')
        .order('vendor_name'),
      supabase
        .from('mm_material')
        .select('mm_material, mm_comercial, mm_desc, mm_price_cents, mm_purchase_price_cents')
    ])

    vendors = vendorsResult.status === 'fulfilled' ? (vendorsResult.value.data || []) : []
    materials = materialsResult.status === 'fulfilled' ? (materialsResult.value.data || []) : []
    
    // Dados carregados com sucesso via RLS

  } catch (error) {
    console.error('Error loading data for new purchase order:', error)
  }

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/mm/purchases" className="btn-fiori-outline flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Novo Pedido de Compra</h1>
              <p className="text-gray-300 mt-2">Criar novo pedido de compra no sistema</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <NewPOClient 
          vendors={vendors}
          materials={materials}
          selectedVendorId={selectedVendorId}
        />
      </div>
    </div>
  )
}
