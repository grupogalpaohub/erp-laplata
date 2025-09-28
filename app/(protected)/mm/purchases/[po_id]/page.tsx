import { getSupabaseServerClient } from '@/lib/supabase/server'
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

async function getPurchaseOrder(po_id: string): Promise<PurchaseOrder | null> {
  const supabase = getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from('mm_purchase_order')
    .select('*')
    .eq('mm_order', po_id)
    .single()

  if (error) {
    console.error('Error fetching purchase order:', error)
    return null
  }

  return data
}

async function getPurchaseOrderItems(po_id: string): Promise<PurchaseOrderItem[]> {
  const supabase = getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from('mm_purchase_order_item')
    .select(`
      po_item_id,
      mm_material,
      mm_qtt,
      unit_cost_cents,
      line_total_cents,
      notes,
      mm_comercial: false, // mapeado no código
      mm_desc
    `)
    .eq('mm_order', po_id)
    .order('po_item_id')

  if (error) {
    console.error('Error fetching purchase order items:', error)
    return []
  }

  return data || []
}

async function getVendor(vendorId: string) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from('mm_vendor')
    .select('vendor_id, vendor_name, email, telefone')
    .eq('vendor_id', vendorId)
    .single()

  if (error) {
    console.error('Error fetching vendor:', error)
    return null
  }

  return data
}

export default async function PurchaseOrderDetailPage({ params }: { params: { po_id: string } }) {
  const [purchaseOrder, items] = await Promise.all([
    getPurchaseOrder(params.po_id),
    getPurchaseOrderItems(params.po_id)
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