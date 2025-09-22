import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function PUT(
  request: NextRequest,
  { params }: { params: { so_id: string } }
) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    const soId = params.so_id

    const {
      selectedCustomer,
      orderDate,
      paymentMethod,
      paymentTerm,
      totalNegotiatedCents,
      notes,
      items,
      totalFinalCents
    } = await request.json()

    // Validar dados obrigatórios
    if (!selectedCustomer || !orderDate || !paymentMethod || !paymentTerm) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Pelo menos um item é obrigatório' },
        { status: 400 }
      )
    }

    // Atualizar pedido de venda (usar apenas campos existentes)
    const { error: orderError } = await supabase
      .from('sd_sales_order')
      .update({
        customer_id: selectedCustomer,
        order_date: orderDate,
        total_cents: totalNegotiatedCents || totalFinalCents
      })
      .eq('tenant_id', tenantId)
      .eq('so_id', soId)

    if (orderError) {
      console.error('Error updating sales order:', orderError)
      return NextResponse.json(
        { error: 'Erro ao atualizar pedido de venda' },
        { status: 500 }
      )
    }

    // Deletar itens existentes
    const { error: deleteError } = await supabase
      .from('sd_sales_order_item')
      .delete()
      .eq('tenant_id', tenantId)
      .eq('so_id', soId)

    if (deleteError) {
      console.error('Error deleting existing items:', deleteError)
      return NextResponse.json(
        { error: 'Erro ao atualizar itens do pedido' },
        { status: 500 }
      )
    }

    // Criar novos itens (usar apenas campos existentes)
    const orderItems = items.map((item: any, index: number) => ({
      so_id: soId,
      tenant_id: tenantId,
      sku: item.material_id, // Usar material_id como sku
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
      message: 'Pedido atualizado com sucesso'
    })

  } catch (error) {
    console.error('Error in update order API:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
