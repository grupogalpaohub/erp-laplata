import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
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
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (k) => cookieStore.get(k)?.value } }
    )
    
    await requireSession()
    
    // GUARDRAIL: Derivar tenant_id da sessão
    const { data: session } = await supabase.auth.getSession();
    console.log('Session data:', session);
    
    if (!session?.session?.user) {
      console.log('No user in session, using default tenant');
      const tenant_id = 'LaplataLunaria';
    } else {
      const tenant_id = session.session.user.user_metadata?.tenant_id || 'LaplataLunaria';
      console.log('User tenant_id:', tenant_id);
    }
    
    const tenant_id = session?.session?.user?.user_metadata?.tenant_id || 'LaplataLunaria';

    // Buscar dados necessários com filtro por tenant_id
    const [vendorsResult, materialsResult] = await Promise.allSettled([
      supabase
        .from('mm_vendor')
        .select('vendor_id, vendor_name')
        .eq('tenant_id', tenant_id)
        .order('vendor_name'),
      supabase
        .from('mm_material')
        .select('mm_material, mm_comercial, mm_desc, mm_price_cents, mm_purchase_price_cents')
        .eq('tenant_id', tenant_id)
    ])

    vendors = vendorsResult.status === 'fulfilled' ? (vendorsResult.value.data || []) : []
    materials = materialsResult.status === 'fulfilled' ? (materialsResult.value.data || []) : []
    
    console.log('=== DATA LOADING DEBUG ===')
    console.log('Tenant ID:', tenant_id)
    console.log('Vendors loaded:', vendors.length, vendors)
    console.log('Materials loaded:', materials.length, materials)
    console.log('Vendors result status:', vendorsResult.status)
    console.log('Materials result status:', materialsResult.status)
    if (materialsResult.status === 'rejected') {
      console.log('Materials error:', materialsResult.reason)
    } else if (materialsResult.status === 'fulfilled') {
      console.log('Materials raw data:', materialsResult.value.data)
      console.log('Materials count:', materialsResult.value.data?.length || 0)
    }

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
