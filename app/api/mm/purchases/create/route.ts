import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'
import { toCents, formatBRL } from '@/lib/money'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()

    const body = await request.json()
    const { vendor_id, po_date, expected_delivery, notes, items } = body

    // Validar campos obrigatórios
    if (!vendor_id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Fornecedor é obrigatório' 
      }, { status: 400 })
    }

    if (!po_date) {
      return NextResponse.json({ 
        success: false, 
        error: 'Data do pedido é obrigatória' 
      }, { status: 400 })
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Adicione pelo menos um item' 
      }, { status: 400 })
    }

    // Gerar ID do pedido
    const generatePOId = async () => {
      const { data: lastPO } = await supabase
        .from('mm_purchase_order')
        .select('po_id')
        .eq('tenant_id', tenantId)
        .order('po_id', { ascending: false })
        .limit(1)
      
      let nextNum = 1
      if (lastPO && lastPO.length > 0) {
        const lastId = lastPO[0].po_id
        const lastNum = parseInt(lastId.replace('PO-', ''))
        nextNum = lastNum + 1
      }
      
      return `PO-${nextNum.toString().padStart(6, '0')}`
    }

    const poId = await generatePOId()

    // Calcular total
    const totalCents = items.reduce((sum: number, item: any) => {
      return sum + toCents(item.total)
    }, 0)

    // Criar cabeçalho do pedido
    const { data: poData, error: poError } = await supabase
      .from('mm_purchase_order')
      .insert([{
        tenant_id: tenantId,
        po_id: poId,
        vendor_id: vendor_id,
        po_date: po_date,
        expected_delivery: expected_delivery || null,
        notes: notes || null,
        status: 'draft',
        total_cents: totalCents,
        created_at: new Date().toISOString()
      }])
      .select('po_id')
      .single()

    if (poError) {
      console.error('Error creating purchase order:', poError)
      return NextResponse.json({ 
        success: false, 
        error: poError.message 
      }, { status: 500 })
    }

    // Criar itens do pedido
    const orderItems = items.map((item: any) => ({
      tenant_id: tenantId,
      po_id: poId,
      material_id: item.material_id,
      mm_qtt: item.quantity,
      unit_cost_cents: toCents(item.unit_price),
      line_total_cents: toCents(item.total)
    }))

    const { error: itemsError } = await supabase
      .from('mm_purchase_order_item')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating purchase order items:', itemsError)
      return NextResponse.json({ 
        success: false, 
        error: itemsError.message 
      }, { status: 500 })
    }

    revalidatePath('/mm/purchases')
    return NextResponse.json({ 
      success: true, 
      po_id: poData.po_id 
    })

  } catch (error) {
    console.error('Error creating purchase order:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
