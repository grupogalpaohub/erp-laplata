import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    
    // Buscar pedidos de venda (com todos os campos disponíveis)
    const { data: orders, error } = await supabase
      .from('sd_sales_order')
      .select(`
        so_id,
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

    // Gerar ID sequencial do pedido
    const { data: lastOrder } = await supabase
      .from('sd_sales_order')
      .select('so_id')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(1)

    const lastOrderNumber = lastOrder?.[0]?.so_id || 'SO-2025-000'
    const nextNumber = parseInt(lastOrderNumber.split('-')[2]) + 1
    const newSoId = `SO-2025-${nextNumber.toString().padStart(3, '0')}`

    // Criar pedido de venda (com todos os campos disponíveis)
    const { data: salesOrder, error: orderError } = await supabase
      .from('sd_sales_order')
      .insert({
        so_id: newSoId,
        tenant_id: tenantId,
        customer_id: selectedCustomer,
        order_date: orderDate,
        payment_method: paymentMethod,
        payment_term: paymentTerm,
        total_cents: totalNegotiatedCents || totalFinalCents,
        total_final_cents: totalFinalCents,
        total_negotiated_cents: totalNegotiatedCents,
        notes: notes || null,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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

    // Criar itens do pedido (com todos os campos disponíveis)
    const orderItems = items.map((item: any, index: number) => ({
      so_id: newSoId,
      tenant_id: tenantId,
      sku: item.material_id,
      material_id: item.material_id,
      quantity: item.quantity,
      unit_price_cents: item.unit_price_cents,
      unit_price_cents_at_order: item.unit_price_cents,
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
        .eq('so_id', newSoId)
        .eq('tenant_id', tenantId)
      
      return NextResponse.json(
        { error: 'Erro ao criar itens do pedido' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      so_id: newSoId,
      message: 'Pedido de venda criado com sucesso'
    })

  } catch (error) {
    console.error('Error in sales order creation:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
