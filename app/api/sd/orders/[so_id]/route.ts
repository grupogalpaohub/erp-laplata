import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { so_id: string } }
) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    const { so_id } = params
    
    const body = await request.json()
    const {
      selectedCustomer,
      orderDate,
      totalNegotiatedCents,
      notes,
      items,
      totalFinalCents
    } = body

    // Validar dados obrigatórios
    if (!selectedCustomer || !orderDate) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Adicione pelo menos um item' },
        { status: 400 }
      )
    }

    // Atualizar pedido de venda
    const { data: salesOrder, error: orderError } = await supabase
      .from('sd_sales_order')
      .update({
        customer_id: selectedCustomer,
        order_date: orderDate,
        total_cents: totalNegotiatedCents || totalFinalCents,
        total_negotiated_cents: totalNegotiatedCents,
        notes: notes || null
      })
      .eq('tenant_id', tenantId)
      .eq('so_id', so_id)
      .select()
      .single()

    if (orderError) {
      console.error('Error updating sales order:', orderError)
      return NextResponse.json(
        { error: 'Erro ao atualizar pedido de venda' },
        { status: 500 }
      )
    }

    // Remover itens existentes
    const { error: deleteError } = await supabase
      .from('sd_sales_order_item')
      .delete()
      .eq('tenant_id', tenantId)
      .eq('so_id', so_id)

    if (deleteError) {
      console.error('Error deleting order items:', deleteError)
      return NextResponse.json(
        { error: 'Erro ao remover itens do pedido' },
        { status: 500 }
      )
    }

    // Criar novos itens do pedido
    const orderItems = items.map((item: any, index: number) => ({
      so_id: so_id,
      tenant_id: tenantId,
      sku: item.material_id,
      quantity: item.quantity,
      unit_price_cents: item.unit_price_cents,
      line_total_cents: item.line_total_cents,
      row_no: index + 1
    }))

    const { error: itemsError } = await supabase
      .from('sd_sales_order_item')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      return NextResponse.json(
        { error: 'Erro ao criar itens do pedido' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Pedido de venda atualizado com sucesso',
      order: salesOrder
    })

  } catch (error) {
    console.error('Error in sales order update:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}