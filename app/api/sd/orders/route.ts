import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    
    // Buscar pedidos de venda (incluir doc_no e campos de valor)
    const { data: orders, error } = await supabase
      .from('sd_sales_order')
      .select(`
        so_id,
        doc_no,
        customer_id,
        status,
        order_date,
        expected_ship,
        total_cents,
        total_final_cents,
        total_negotiated_cents,
        payment_method,
        payment_term,
        notes,
        created_at,
        crm_customer(name)
      `)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching sales orders:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar pedidos de venda' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      orders: orders || [],
      count: orders?.length || 0
    })

  } catch (error) {
    console.error('Error in sales orders GET:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    
    const body = await request.json()
    const {
      selectedCustomer,
      orderDate,
      paymentMethod,
      paymentTerm,
      totalNegotiatedCents,
      notes,
      items,
      totalFinalCents
    } = body

    // Validar dados obrigatórios
    if (!selectedCustomer || !orderDate || !paymentMethod || !paymentTerm) {
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

    // Criar pedido de venda (trigger vai gerar so_id automaticamente)
    const { data: salesOrder, error: orderError } = await supabase
      .from('sd_sales_order')
      .insert({
        tenant_id: tenantId,
        customer_id: selectedCustomer,
        order_date: orderDate,
        total_cents: totalNegotiatedCents || totalFinalCents,
        total_final_cents: totalFinalCents,
        total_negotiated_cents: totalNegotiatedCents,
        payment_method: paymentMethod,
        payment_term: paymentTerm,
        notes: notes,
        status: 'draft'
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating sales order:', orderError)
      return NextResponse.json(
        { error: 'Erro ao criar pedido de venda' },
        { status: 500 }
      )
    }

    // Criar itens do pedido (usar so_id gerado pelo trigger)
    const orderItems = items.map((item: any, index: number) => ({
      so_id: salesOrder.so_id,
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
      // Rollback do pedido se falhar ao criar itens
      await supabase
        .from('sd_sales_order')
        .delete()
        .eq('so_id', salesOrder.so_id)
        .eq('tenant_id', tenantId)
      
      return NextResponse.json(
        { error: 'Erro ao criar itens do pedido' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      so_id: salesOrder.so_id,
      message: 'Pedido de venda criado com sucesso',
      order: salesOrder
    })

  } catch (error) {
    console.error('Error in sales order creation:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
