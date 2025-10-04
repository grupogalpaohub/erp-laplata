import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

type Params = { so_id: string }

export async function GET(_req: Request, { params }: { params: Params }) {
  const soId = params?.so_id ?? ''
  if (!soId) {
    return NextResponse.json({ ok: false, error: { message: 'missing so_id' } }, { status: 400 })
  }

  try {
    const supabase = supabaseServer()

    // Buscar pedido de vendas
    const { data: order, error } = await supabase
      .from('sd_sales_order')
      .select(`
        so_id,
        doc_no,
        customer_id,
        status,
        order_date,
        expected_ship,
        line_total_cents,
        total_final_cents,
        total_negotiated_cents,
        payment_method,
        payment_term,
        notes,
        created_at,
        crm_customer(name)
      `)
      .eq('so_id', soId)
      .single()

    if (error) {
      console.error('Error fetching sales order:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: error.code, 
          message: error.message 
        } 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      ok: true, 
      order 
    }, { status: 200 })

  } catch (error) {
    console.error('Unexpected error in GET /api/sd/orders/[so_id]:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'Erro interno do servidor' 
      } 
    }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Params }) {
  const soId = params?.so_id ?? ''
  if (!soId) {
    return NextResponse.json({ ok: false, error: { message: 'missing so_id' } }, { status: 400 })
  }

  try {
    const supabase = supabaseServer()
    
    let body
    try {
      body = await req.json()
    } catch (parseError) {
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: 'INVALID_JSON', 
          message: 'JSON inválido recebido' 
        } 
      }, { status: 400 })
    }

    // Validar campos obrigatórios
    if (!body.selectedCustomer) {
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: 'MISSING_CUSTOMER', 
          message: 'Cliente é obrigatório' 
        } 
      }, { status: 400 })
    }

    if (!body.orderDate) {
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: 'MISSING_ORDER_DATE', 
          message: 'Data do pedido é obrigatória' 
        } 
      }, { status: 400 })
    }

    // Preparar dados para atualização - ✅ GUARDRAIL COMPLIANCE: Campos conforme schema real
    const updateData = {
      customer_id: body.selectedCustomer,
      order_date: body.orderDate,
      status: body.status || 'draft',
      expected_ship: body.expectedShip || null,
      payment_method: body.paymentMethod || null,
      payment_term: body.paymentTerm || null,
      notes: body.notes || null,
      total_final_cents: body.totalFinalCents || 0,
      total_negotiated_cents: body.totalNegotiatedCents || body.totalFinalCents || 0,
    }

    // Dados preparados para atualização

    // Atualizar pedido
    const { data, error } = await supabase
      .from('sd_sales_order')
      .update(updateData)
      .eq('so_id', soId)
      .select(`
        so_id,
        doc_no,
        customer_id,
        status,
        order_date,
        expected_ship,
        line_total_cents,
        total_final_cents,
        total_negotiated_cents,
        payment_method,
        payment_term,
        notes,
        created_at
      `)
      .single()

    if (error) {
      console.error('🔍 [DEBUG] Error updating sales order:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: error.code, 
          message: error.message 
        } 
      }, { status: 500 })
    }

    // Calcular novo total dos itens
    let newTotalAmountCents = 0
    if (body.items && Array.isArray(body.items)) {
      newTotalAmountCents = body.items.reduce((sum, item) => {
        return sum + (item.line_total_cents || 0)
      }, 0)
    }

    // Atualizar total do pedido
    if (newTotalAmountCents > 0) {
      const { error: updateTotalError } = await supabase
        .from('sd_sales_order')
        .update({ total_amount_cents: newTotalAmountCents })
        .eq('so_id', soId)
        .eq('tenant_id', tenantId)

      if (updateTotalError) {
        console.error('🔍 [DEBUG] Error updating order total:', updateTotalError)
      }
    }

    // Se há itens para atualizar, processar
    if (body.items && Array.isArray(body.items)) {
      // Processando itens do pedido
      
      // Primeiro, remover itens existentes
      const { error: deleteError } = await supabase
        .from('sd_sales_order_item')
        .delete()
        .eq('so_id', soId)

      if (deleteError) {
        console.error('🔍 [DEBUG] Error deleting existing items:', deleteError)
        // Não falhar por causa dos itens, apenas logar
      } else {
        // Itens existentes removidos com sucesso
      }

      // Inserir novos itens
      for (let i = 0; i < body.items.length; i++) {
        const item = body.items[i]
        
        if (item.mm_material && item.quantity > 0) {
          const itemData = {
            so_id: soId,
            sku: item.mm_material, // Usar mm_material como sku
            mm_material: item.mm_material,
            material_id: item.mm_material, // material_id deve ser igual a mm_material
            quantity: Number(item.quantity),
            unit_price_cents: item.unit_price_cents || 0,
            line_total_cents: item.line_total_cents || 0,
            row_no: i + 1
          }
          
          // Inserindo item do pedido
          
          const { error: itemError } = await supabase
            .from('sd_sales_order_item')
            .insert(itemData)

          if (itemError) {
            console.error(`🔍 [DEBUG] Error inserting item ${i + 1}:`, itemError)
            // Não falhar por causa dos itens, apenas logar
          } else {
            // Item inserido com sucesso
          }
        }
      }
    }

    return NextResponse.json({ 
      ok: true, 
      data 
    }, { status: 200 })

  } catch (error) {
    console.error('Unexpected error in PUT /api/sd/orders/[so_id]:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'Erro interno do servidor' 
      } 
    }, { status: 500 })
  }
}
