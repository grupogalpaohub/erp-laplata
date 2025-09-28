import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireSession } from '@/lib/auth/requireSession'
import Link from 'next/link'
import { ArrowLeft, Printer, Edit } from 'lucide-react'
import PurchaseOrderClient from './PurchaseOrderClient'

interface PurchaseOrder {
  mm_order: string
  vendor_id: string
  po_date: string
  status: string
  total_cents: number
  expected_delivery?: string
  notes?: string
  created_at: string
}

interface PurchaseOrderItem {
  po_item_id: number
  mm_material: string
  mm_comercial: boolean // mapeado no código
  mm_desc: string | null
  mm_qtt: number
  unit_cost_cents: number
  line_total_cents: number
  notes?: string
}

async function getPurchaseOrder(mm_order: string): Promise<PurchaseOrder | null> {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (k) => cookieStore.get(k)?.value } }
  )
  
  // Obter tenant_id da sessão
  const { data: { session } } = await supabase.auth.getSession()
  const tenant_id = session?.user?.user_metadata?.tenant_id || 'LaplataLunaria'
  
  const { data, error } = await supabase
    .from('mm_purchase_order')
    .select('*')
    .eq('tenant_id', tenant_id)
    .eq('mm_order', mm_order)
    .single()

  if (error) {
    console.error('Error fetching purchase order:', error)
    return null
  }

  return data
}

async function getPurchaseOrderItems(mm_order: string): Promise<PurchaseOrderItem[]> {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (k) => cookieStore.get(k)?.value } }
  )
  
  // Obter tenant_id da sessão
  const { data: { session } } = await supabase.auth.getSession()
  const tenant_id = session?.user?.user_metadata?.tenant_id || 'LaplataLunaria'
  
  const { data, error } = await supabase
    .from('mm_purchase_order_item')
    .select(`
      po_item_id,
      mm_material,
      mm_qtt,
      unit_cost_cents,
      line_total_cents,
      notes,
      material:mm_material!inner (
        mm_desc,
        mm_comercial
      )
    `)
    .eq('tenant_id', tenant_id)
    .eq('mm_order', mm_order)
    .order('po_item_id')

  if (error) {
    console.error('Error fetching purchase order items:', error)
    return []
  }

  // Mapear os dados para o formato esperado
  return (data || []).map(item => ({
    po_item_id: item.po_item_id,
    mm_material: item.mm_material,
    mm_comercial: item.material?.mm_comercial || false,
    mm_desc: item.material?.mm_desc || null,
    mm_qtt: item.mm_qtt,
    unit_cost_cents: item.unit_cost_cents,
    line_total_cents: item.line_total_cents,
    notes: item.notes
  }))
}

async function getVendor(vendorId: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (k) => cookieStore.get(k)?.value } }
  )
  
  // Obter tenant_id da sessão
  const { data: { session } } = await supabase.auth.getSession()
  const tenant_id = session?.user?.user_metadata?.tenant_id || 'LaplataLunaria'
  
  const { data, error } = await supabase
    .from('mm_vendor')
    .select('vendor_id, vendor_name, email, telefone')
    .eq('tenant_id', tenant_id)
    .eq('vendor_id', vendorId)
    .single()

  if (error) {
    console.error('Error fetching vendor:', error)
    return null
  }

  return data
}

export default async function PurchaseOrderDetailPage({ params }: { params: { mm_order: string } }) {
  const [purchaseOrder, items] = await Promise.all([
    getPurchaseOrder(params.mm_order),
    getPurchaseOrderItems(params.mm_order)
  ])

  const vendor = purchaseOrder ? await getVendor(purchaseOrder.vendor_id) : null

  if (!purchaseOrder) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div className="card-fiori text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Pedido não encontrado</h1>
          <p className="text-gray-500 mb-6">O pedido de compras solicitado não foi encontrado.</p>
          <Link href="/mm/purchases" className="btn-fiori-primary">
            Voltar para Pedidos
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/mm/purchases" className="btn-fiori-outline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">Pedido de Compras {purchaseOrder.mm_order}</h1>
            <p className="text-gray-500 mt-1">Detalhes do pedido de compras</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link 
            href={`/mm/purchases/${purchaseOrder.mm_order}/edit`}
            className="btn-fiori-outline flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar
          </Link>
          <button className="btn-fiori-outline flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>

      <PurchaseOrderClient order={purchaseOrder} items={items} vendor={vendor} />
    </main>
  )
}