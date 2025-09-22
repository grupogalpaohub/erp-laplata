import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'

export const runtime = 'nodejs'

export async function PUT(
  request: NextRequest,
  { params }: { params: { po_id: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()

    const body = await request.json()
    const { status } = body

    // Validar status permitidos
    const validStatuses = ['draft', 'placed', 'received', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
    }

    // Buscar pedido atual
    const { data: currentOrder, error: fetchError } = await supabase
      .from('mm_purchase_order')
      .select('status')
      .eq('mm_order', params.po_id)
      .eq('tenant_id', tenantId)
      .single()

    if (fetchError) {
      console.error('Error fetching purchase order:', fetchError)
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    // Validar transição de status
    const currentStatus = currentOrder.status
    const validTransitions: { [key: string]: string[] } = {
      'draft': ['placed', 'cancelled'],
      'placed': ['received', 'cancelled'],
      'received': ['cancelled'],
      'cancelled': []
    }

    if (!validTransitions[currentStatus]?.includes(status)) {
      return NextResponse.json({ 
        error: `Transição de status inválida: ${currentStatus} → ${status}` 
      }, { status: 400 })
    }

    // Atualizar status
    const { error } = await supabase
      .from('mm_purchase_order')
      .update({ status })
      .eq('mm_order', params.po_id)
      .eq('tenant_id', tenantId)

    if (error) {
      console.error('Error updating purchase order status:', error)
      return NextResponse.json({ error: 'Erro ao atualizar status' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Status atualizado para ${status}` 
    })

  } catch (error) {
    console.error('Error updating purchase order status:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
