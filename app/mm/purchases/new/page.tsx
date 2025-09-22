import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'
import Link from 'next/link'
import NewPOClient from './NewPOClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function NewPOPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const tenantId = await getTenantId()

  // Buscar dados iniciais
  const [vendorsResult, materialsResult] = await Promise.all([
    supabase
      .from('mm_vendor')
      .select('vendor_id, vendor_name')
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .order('vendor_name'),
    supabase
      .from('mm_material')
      .select('mm_material, mm_comercial, mm_desc, mm_purchase_price_cents')
      .eq('tenant_id', tenantId)
      .order('mm_material')
  ])

  const vendors = vendorsResult.data || []
  const materials = materialsResult.data || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">Criar Pedido de Compras</h1>
        <p className="text-xl text-fiori-secondary mb-2">Gerar novo pedido de compras</p>
        <p className="text-lg text-fiori-muted">Selecione fornecedor e materiais para criar o pedido</p>
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <Link href="/mm/purchases" className="btn-fiori-outline">Voltar</Link>
      </div>

      {/* Client Component */}
      <NewPOClient vendors={vendors} materials={materials} />
    </div>
  )
}