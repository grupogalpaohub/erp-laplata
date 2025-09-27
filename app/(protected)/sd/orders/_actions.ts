'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth/requireSession'
import { toCents, formatBRL } from '@/lib/money'
import { revalidatePath } from 'next/cache'

export async function createOrderAction(input: {
  customer_id: string
  payment_method?: string | null
  payment_term?: string | null
  notes?: string | null
}) {
  try {
    await requireSession()
    const supabase = getSupabaseServerClient()
    
    // Gerar ID único baseado em timestamp
    const timestamp = Date.now()
    const newSoId = `SO-${timestamp}`

    // Criar pedido de venda com ID gerado
    const { data: salesOrder, error: orderError } = await supabase
      .from('sd_sales_order')
      .insert({
        so_id: newSoId,
        customer_id: input.customer_id,
        order_date: new Date().toISOString().split('T')[0],
        payment_method: input.payment_method || null,
        payment_term: input.payment_term || null,
        notes: input.notes || null,
        status: 'draft'
      })
      .select('so_id')
      .single()

    if (orderError) {
      console.error('Error creating sales order:', orderError)
      return { success: false, error: orderError.message }
    }

    revalidatePath('/sd/orders')
    return { success: true, so_id: salesOrder.so_id }

  } catch (error) {
    console.error('Error in createOrderAction:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function addOrderItemAction(input: {
  so_id: string
  mm_material: string
  mm_qtt: number
  unit_price_brl?: string // opcional se houver negociação manual
}) {
  try {
    await requireSession()
    const supabase = getSupabaseServerClient()
    
    // Buscar preço do material se não fornecido
    let unit_price_cents = 0
    if (input.unit_price_brl) {
      unit_price_cents = toCents(Number(input.unit_price_brl))
    } else {
      const { data: material } = await supabase
        .from('mm_material')
        .select('mm_price_cents')
        .eq('mm_material', input.mm_material)
        .single()
      
      unit_price_cents = material?.mm_price_cents || 0
    }

    // Calcular total da linha
    const line_total_cents = input.mm_qtt * unit_price_cents

    // Buscar próximo número da linha
    const { data: lastItem } = await supabase
      .from('sd_sales_order_item')
      .select('row_no')
      .eq('so_id', input.so_id)
      .order('row_no', { ascending: false })
      .limit(1)

    const nextRowNo = (lastItem?.[0]?.row_no || 0) + 1

    // Inserir item do pedido
    const { error } = await supabase
      .from('sd_sales_order_item')
      .insert({
        so_id: input.so_id,
        mm_material: input.mm_material, // FK lógica para mm_material
        mm_qtt: input.mm_qtt,
        unit_price_cents_at_order: unit_price_cents,
        line_total_cents: line_total_cents,
        row_no: nextRowNo
      })

    if (error) {
      console.error('Error adding order item:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/sd/orders')
    return { success: true }

  } catch (error) {
    console.error('Error in addOrderItemAction:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function removeOrderItemAction(input: {
  so_id: string
  row_no: number
}) {
  try {
    await requireSession()
    const supabase = getSupabaseServerClient()
    
    const { error } = await supabase
      .from('sd_sales_order_item')
      .delete()
      .eq('so_id', input.so_id)
      .eq('row_no', input.row_no)

    if (error) {
      console.error('Error removing order item:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/sd/orders')
    return { success: true }

  } catch (error) {
    console.error('Error in removeOrderItemAction:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function updateOrderAction(input: {
  so_id: string
  payment_method?: string | null
  payment_term?: string | null
  notes?: string | null
  total_negotiated_cents?: number | null
}) {
  try {
    await requireSession()
    const supabase = getSupabaseServerClient()
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (input.payment_method !== undefined) updateData.payment_method = input.payment_method
    if (input.payment_term !== undefined) updateData.payment_term = input.payment_term
    if (input.notes !== undefined) updateData.notes = input.notes
    if (input.total_negotiated_cents !== undefined) updateData.total_negotiated_cents = input.total_negotiated_cents

    const { error } = await supabase
      .from('sd_sales_order')
      .update(updateData)
      .eq('so_id', input.so_id)

    if (error) {
      console.error('Error updating order:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/sd/orders')
    return { success: true }

  } catch (error) {
    console.error('Error in updateOrderAction:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function updateOrderStatusAction(input: {
  so_id: string
  status: string
}) {
  try {
    await requireSession()
    const supabase = getSupabaseServerClient()
    
    // Validar status permitidos (conforme enum order_status no Supabase)
    const allowedStatuses = ['draft', 'approved', 'invoiced', 'cancelled']
    if (!allowedStatuses.includes(input.status)) {
      return { success: false, error: 'Status inválido' }
    }
    
    const { error } = await supabase
      .from('sd_sales_order')
      .update({
        status: input.status,
        updated_at: new Date().toISOString()
      })
      .eq('so_id', input.so_id)

    if (error) {
      console.error('Error updating order status:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/sd/orders')
    return { success: true }

  } catch (error) {
    console.error('Error in updateOrderStatusAction:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}



