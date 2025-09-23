import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()

    const body = await request.json()
    const { vendor_id, po_date, expected_delivery, notes, items } = body

    if (!vendor_id) {
      return NextResponse.json({ error: 'Fornecedor é obrigatório' }, { status: 400 })
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Adicione pelo menos um item ao pedido' }, { status: 400 })
    }

    // Gerar ID do pedido único
    const generateOrderId = async () => {
      let attempts = 0
      const maxAttempts = 10
      
      while (attempts < maxAttempts) {
        // Buscar último pedido para este tenant
        const { data: lastOrder } = await supabase
          .from('mm_purchase_order')
          .select('mm_order')
          .eq('tenant_id', tenantId)
          .order('mm_order', { ascending: false })
          .limit(1)
        
        let nextNum = 1
        if (lastOrder && lastOrder.length > 0) {
          const lastId = lastOrder[0].mm_order
          const lastNum = parseInt(lastId.replace('PO-', ''))
          nextNum = lastNum + 1
        }
        
        const candidateId = `PO-${nextNum.toString().padStart(6, '0')}`
        
        // Verificar se o ID já existe
        const { data: existingOrder } = await supabase
          .from('mm_purchase_order')
          .select('mm_order')
          .eq('mm_order', candidateId)
          .single()
        
        if (!existingOrder) {
          return candidateId
        }
        
        attempts++
      }
      
      // Se chegou aqui, usar timestamp como fallback
      return `PO-${Date.now().toString().slice(-6)}`
    }

    const orderId = await generateOrderId()

    // Criar header do pedido
    const header = {
      tenant_id: tenantId,
      mm_order: orderId,
      vendor_id: vendor_id,
      po_date: po_date,
      expected_delivery: expected_delivery || null,
      notes: notes || null,
      status: 'draft' as const,
      total_amount: 0, // Será calculado
    }

    const { data: headerData, error: headerError } = await supabase
      .from('mm_purchase_order')
      .insert(header)
      .select('mm_order')
      .single()

    if (headerError) {
      console.error('Erro ao criar cabeçalho do pedido:', headerError)
      return NextResponse.json({ error: `Erro ao criar pedido: ${headerError.message}` }, { status: 500 })
    }

    // Criar itens do pedido
    const orderItems = items.map((item: any, index: number) => ({
      tenant_id: tenantId,
      mm_order: headerData.mm_order,
      plant_id: 'WH-001',
      mm_material: item.material,
      mm_qtt: item.quantity,
      unit_cost_cents: Math.round(item.unitPrice * 10000),
      line_total_cents: Math.round(item.total * 10000),
      currency: 'BRL',
      po_item_id: index + 1
    }))

    // Inserir itens do pedido
    const { error: itemsError } = await supabase
      .from('mm_purchase_order_item')
      .insert(orderItems)

    if (itemsError) {
      console.error('Erro ao inserir itens do pedido:', itemsError)
      return NextResponse.json({ error: `Erro ao inserir itens do pedido: ${itemsError.message}` }, { status: 500 })
    }

    // Atualizar total_amount no cabeçalho do pedido (já em centavos)
    const totalAmount = items.reduce((sum: number, item: any) => sum + Math.round(item.total * 10000), 0)
    const { error: updateError } = await supabase
      .from('mm_purchase_order')
      .update({ total_amount: totalAmount })
      .eq('mm_order', headerData.mm_order)

    if (updateError) {
      console.error('Erro ao atualizar total do pedido:', updateError)
      return NextResponse.json({ error: `Erro ao atualizar total do pedido: ${updateError.message}` }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      mm_order: headerData.mm_order,
      message: 'Pedido criado com sucesso'
    })

  } catch (error) {
    console.error('Erro inesperado ao criar pedido:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
