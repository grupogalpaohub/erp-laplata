// app/(protected)/sd/_actions.ts
// Server Actions para SD (Sales & Distribution)
// GUARDRAIL COMPLIANCE: @supabase/ssr + cookies()

"use server"

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireSession } from "@/lib/auth/requireSession"
import { revalidatePath } from "next/cache"
import { toCents } from "@/lib/money"
import { SD_SalesOrder, SD_SalesOrderItem } from '@/src/types/db'

// Helper function para criar cliente Supabase com guardrails compliance
function getSupabaseClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

export async function createSalesOrder(formData: FormData) {
  console.log('🔍 [DEBUG] Iniciando createSalesOrder...')
  try {
    await requireSession()
    const supabase = getSupabaseClient()
    
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session?.user) {
      console.log('❌ [DEBUG] Usuário não autenticado')
      return {
        success: false,
        error: 'Usuário não autenticado'
      }
    }
    
    const tenant_id = session.session.user.user_metadata?.tenant_id || 'LaplataLunaria'
    console.log('✅ [DEBUG] Tenant ID:', tenant_id)
    
    // VALIDAÇÃO: Campos obrigatórios
    const customer_id = formData.get('customer_id') as string
    const status = formData.get('status') as string || 'draft'
    
    console.log('🔍 [DEBUG] customer_id:', customer_id)
    console.log('🔍 [DEBUG] status:', status)
    
    if (!customer_id) {
      console.log('❌ [DEBUG] customer_id é obrigatório')
      return {
        success: false,
        error: 'customer_id é obrigatório'
      }
    }
    
    // VALIDAÇÃO: Status enum
    if (!['draft', 'approved', 'invoiced', 'cancelled'].includes(status)) {
      console.log('❌ [DEBUG] Status inválido:', status)
      return {
        success: false,
        error: 'Status inválido. Valores aceitos: draft, approved, invoiced, cancelled'
      }
    }
    
    // Gerar so_id único
    const timestamp = Date.now()
    const so_id = `SO-${timestamp}`
    console.log('🔍 [DEBUG] so_id gerado:', so_id)
    
    // Processar totais
    const totalFinalCents = toCents(formData.get('total') as string || '0')
    const totalNegotiatedCents = toCents(formData.get('total_negotiated') as string || '0')
    
    console.log('🔍 [DEBUG] totalFinalCents:', totalFinalCents)
    console.log('🔍 [DEBUG] totalNegotiatedCents:', totalNegotiatedCents)
    
    const salesOrder: SD_SalesOrder = {
      tenant_id,
      so_id,
      customer_id,
      status: status as 'draft' | 'approved' | 'invoiced' | 'cancelled',
      order_date: formData.get('order_date') as string || new Date().toISOString().slice(0, 10),
      expected_ship: formData.get('expected_ship') as string || null,
      total_cents: totalFinalCents,
      doc_no: formData.get('doc_no') as string || null,
      payment_method: null, // Campo removido do formulário
      payment_term: formData.get('payment_term') as string || null,
      total_negotiated_cents: totalNegotiatedCents,
      notes: formData.get('notes') as string || null,
    }
    
    console.log('🔍 [DEBUG] Sales Order payload:', JSON.stringify(salesOrder, null, 2))
    
    // Criar o cabeçalho do pedido
    console.log('🔍 [DEBUG] Tentando inserir Sales Order...')
    const { data: orderData, error: orderError } = await supabase
      .from('sd_sales_order')
      .insert(salesOrder)
      .select('*')
      .single()
    
    if (orderError) {
      console.log('❌ [DEBUG] Erro ao criar Sales Order:', orderError)
      return {
        success: false,
        error: `Erro ao criar Sales Order: ${orderError.message}`
      }
    }
    
    console.log('✅ [DEBUG] Sales Order criado com sucesso:', orderData)
    
    // Processar itens do pedido
    const itemsRaw = formData.getAll('items[]') as string[]
    console.log('🔍 [DEBUG] Itens recebidos:', itemsRaw.length)
    
    if (itemsRaw.length > 0) {
      const items = itemsRaw.map(item => JSON.parse(item))
      console.log('🔍 [DEBUG] Itens parseados:', items)
      
      const orderItems = items.map((item, index) => ({
        tenant_id,
        so_id,
        sku: item.mm_material, // Campo obrigatório - usar mm_material como sku
        material_id: item.mm_material, // Campo obrigatório - usar mm_material como material_id
        mm_material: item.mm_material,
        quantity: Number(item.quantity),
        unit_price_cents: item.unit_price_cents,
        line_total_cents: Math.round(item.unit_price_cents * Number(item.quantity)),
        row_no: index + 1,
        unit_price_cents_at_order: item.unit_price_cents,
      }))
      
      console.log('🔍 [DEBUG] Order Items preparados:', orderItems)
      
      const { error: itemsError } = await supabase
        .from('sd_sales_order_item')
        .insert(orderItems)
      
      if (itemsError) {
        console.log('❌ [DEBUG] Erro ao criar itens:', itemsError)
        // Se der erro nos itens, deletar o pedido criado
        await supabase
          .from('sd_sales_order')
          .delete()
          .eq('so_id', so_id)
          .eq('tenant_id', tenant_id)
        
        return {
          success: false,
          error: `Erro ao criar itens do pedido: ${itemsError.message}`
        }
      }
      
      console.log('✅ [DEBUG] Itens criados com sucesso')
    }
    
    revalidatePath('/sd/orders')
    
    console.log('✅ [DEBUG] Pedido criado com sucesso!')
    return {
      success: true,
      data: orderData
    }
    
  } catch (error: any) {
    console.log('❌ [DEBUG] Erro interno:', error)
    return {
      success: false,
      error: `Erro interno: ${error.message}`
    }
  }
}

export async function createSalesOrderItem(formData: FormData) {
  try {
    await requireSession()
    const supabase = getSupabaseClient()
    
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session?.user) {
      return {
        success: false,
        error: 'Usuário não autenticado'
      }
    }
    
    const tenant_id = session.session.user.user_metadata?.tenant_id || 'LaplataLunaria'
    
    // VALIDAÇÃO: Campos obrigatórios
    const so_id = formData.get('so_id') as string
    const mm_material = formData.get('mm_material') as string
    const quantity = formData.get('quantity') as string
    const unit_price_cents = Number(formData.get('unit_price_cents'))
    const line_total_cents = Number(formData.get('line_total_cents'))
    const row_no = Number(formData.get('row_no'))
    
    if (!so_id || !mm_material || !quantity || !unit_price_cents || !line_total_cents || !row_no) {
      return {
        success: false,
        error: 'so_id, mm_material, quantity, unit_price_cents, line_total_cents e row_no são obrigatórios'
      }
    }
    
    // VALIDAÇÃO FK: Verificar se so_id existe
    const { data: soExists, error: soError } = await supabase
      .from('sd_sales_order')
      .select('so_id')
      .eq('tenant_id', tenant_id)
      .eq('so_id', so_id)
      .single()
    
    if (soError || !soExists) {
      return {
        success: false,
        error: `Sales Order '${so_id}' não encontrada`
      }
    }
    
    // VALIDAÇÃO FK: Verificar se mm_material existe
    const { data: materialExists, error: materialError } = await supabase
      .from('mm_material')
      .select('mm_material')
      .eq('tenant_id', tenant_id)
      .eq('mm_material', mm_material)
      .single()
    
    if (materialError || !materialExists) {
      return {
        success: false,
        error: `Material '${mm_material}' não encontrado`
      }
    }
    
    const salesOrderItem: SD_SalesOrderItem = {
      tenant_id,
      so_id,
      mm_material,                    // CORRETO - não material_id
      quantity: Number(quantity),     // ✅ GUARDRAIL COMPLIANCE: Converter string para number
      unit_price_cents,
      line_total_cents,
      row_no,
      unit_price_cents_at_order: unit_price_cents, // Salvar preço no momento do pedido
    }
    
    const { data, error } = await supabase
      .from('sd_sales_order_item')
      .insert(salesOrderItem)
      .select('*')
      .single()
    
    if (error) {
      return {
        success: false,
        error: `Erro ao criar Sales Order Item: ${error.message}`
      }
    }
    
    revalidatePath('/sd')
    
    return {
      success: true,
      data
    }
    
  } catch (error: any) {
    return {
      success: false,
      error: `Erro interno: ${error.message}`
    }
  }
}

export async function getSalesOrders() {
  try {
    await requireSession()
    const supabase = getSupabaseClient()
    
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session?.user) {
      return {
        success: false,
        error: 'Usuário não autenticado'
      }
    }
    
    const tenant_id = session.session.user.user_metadata?.tenant_id || 'LaplataLunaria'
    
    const { data, error } = await supabase
      .from('sd_sales_order')
      .select('*')
      .eq('tenant_id', tenant_id)
      .order('order_date', { ascending: false })
    
    if (error) {
      return {
        success: false,
        error: `Erro ao buscar Sales Orders: ${error.message}`
      }
    }
    
    return {
      success: true,
      data: data || []
    }
    
  } catch (error: any) {
    return {
      success: false,
      error: `Erro interno: ${error.message}`
    }
  }
}

export async function getSalesOrderItems(so_id: string) {
  try {
    await requireSession()
    const supabase = getSupabaseClient()
    
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session?.user) {
      return {
        success: false,
        error: 'Usuário não autenticado'
      }
    }
    
    const tenant_id = session.session.user.user_metadata?.tenant_id || 'LaplataLunaria'
    
    const { data, error } = await supabase
      .from('sd_sales_order_item')
      .select(`
        *,
        mm_material_info:mm_material(
          mm_comercial,
          mm_desc
        )
      `)
      .eq('tenant_id', tenant_id)
      .eq('so_id', so_id)
      .order('row_no')
    
    if (error) {
      return {
        success: false,
        error: `Erro ao buscar Sales Order Items: ${error.message}`
      }
    }
    
    return {
      success: true,
      data: data || []
    }
    
  } catch (error: any) {
    return {
      success: false,
      error: `Erro interno: ${error.message}`
    }
  }
}

export async function updateSalesOrder(formData: FormData) {
  console.log('🔍 [DEBUG] Iniciando updateSalesOrder...')
  try {
    await requireSession()
    const supabase = getSupabaseClient()
    
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session?.user) {
      console.log('❌ [DEBUG] Usuário não autenticado')
      return {
        success: false,
        error: 'Usuário não autenticado'
      }
    }
    
    const tenant_id = session.session.user.user_metadata?.tenant_id || 'LaplataLunaria'
    console.log('✅ [DEBUG] Tenant ID:', tenant_id)
    
    // VALIDAÇÃO: Campos obrigatórios
    const so_id = formData.get('so_id') as string
    const customer_id = formData.get('customer_id') as string
    const status = formData.get('status') as string || 'draft'
    
    console.log('🔍 [DEBUG] so_id:', so_id)
    console.log('🔍 [DEBUG] customer_id:', customer_id)
    console.log('🔍 [DEBUG] status:', status)
    
    if (!so_id || !customer_id) {
      console.log('❌ [DEBUG] so_id e customer_id são obrigatórios')
      return {
        success: false,
        error: 'so_id e customer_id são obrigatórios'
      }
    }
    
    // VALIDAÇÃO: Status enum
    if (!['draft', 'approved', 'invoiced', 'cancelled'].includes(status)) {
      console.log('❌ [DEBUG] Status inválido:', status)
      return {
        success: false,
        error: 'Status inválido. Valores aceitos: draft, approved, invoiced, cancelled'
      }
    }
    
    // Processar totais
    const totalFinalCents = toCents(formData.get('total') as string || '0')
    const totalNegotiatedCents = toCents(formData.get('total_negotiated') as string || '0')
    
    console.log('🔍 [DEBUG] totalFinalCents:', totalFinalCents)
    console.log('🔍 [DEBUG] totalNegotiatedCents:', totalNegotiatedCents)
    
    // Atualizar cabeçalho do pedido
    const salesOrderUpdate = {
      customer_id,
      status: status as 'draft' | 'approved' | 'invoiced' | 'cancelled',
      order_date: formData.get('order_date') as string || new Date().toISOString().slice(0, 10),
      expected_ship: formData.get('expected_ship') as string || null,
      total_cents: totalFinalCents,
      payment_method: null, // Campo removido do formulário
      payment_term: formData.get('payment_term') as string || null,
      total_negotiated_cents: totalNegotiatedCents,
      notes: formData.get('notes') as string || null,
      updated_at: new Date().toISOString()
    }
    
    console.log('🔍 [DEBUG] Sales Order update payload:', JSON.stringify(salesOrderUpdate, null, 2))
    
    // Atualizar o cabeçalho do pedido
    console.log('🔍 [DEBUG] Tentando atualizar Sales Order...')
    const { data: orderData, error: orderError } = await supabase
      .from('sd_sales_order')
      .update(salesOrderUpdate)
      .eq('tenant_id', tenant_id)
      .eq('so_id', so_id)
      .select('*')
      .single()
    
    if (orderError) {
      console.log('❌ [DEBUG] Erro ao atualizar Sales Order:', orderError)
      return {
        success: false,
        error: `Erro ao atualizar Sales Order: ${orderError.message}`
      }
    }
    
    console.log('✅ [DEBUG] Sales Order atualizado com sucesso:', orderData)
    
    // Processar itens do pedido
    const itemsRaw = formData.getAll('items[]') as string[]
    console.log('🔍 [DEBUG] Itens recebidos:', itemsRaw.length)
    
    if (itemsRaw.length > 0) {
      // Deletar itens existentes
      console.log('🔍 [DEBUG] Deletando itens existentes...')
      const { error: deleteError } = await supabase
        .from('sd_sales_order_item')
        .delete()
        .eq('tenant_id', tenant_id)
        .eq('so_id', so_id)
      
      if (deleteError) {
        console.log('❌ [DEBUG] Erro ao deletar itens existentes:', deleteError)
        return {
          success: false,
          error: `Erro ao deletar itens existentes: ${deleteError.message}`
        }
      }
      
      // Inserir novos itens
      const items = itemsRaw.map(item => JSON.parse(item))
      console.log('🔍 [DEBUG] Itens parseados:', items)
      
      const orderItems = items.map((item, index) => ({
        tenant_id,
        so_id,
        sku: item.mm_material, // Campo obrigatório - usar mm_material como sku
        material_id: item.mm_material, // Campo obrigatório - usar mm_material como material_id
        mm_material: item.mm_material,
        quantity: Number(item.quantity),
        unit_price_cents: item.unit_price_cents,
        line_total_cents: Math.round(item.unit_price_cents * Number(item.quantity)),
        row_no: index + 1,
        unit_price_cents_at_order: item.unit_price_cents,
      }))
      
      console.log('🔍 [DEBUG] Order Items preparados:', orderItems)
      
      const { error: itemsError } = await supabase
        .from('sd_sales_order_item')
        .insert(orderItems)
      
      if (itemsError) {
        console.log('❌ [DEBUG] Erro ao criar itens:', itemsError)
        return {
          success: false,
          error: `Erro ao criar itens do pedido: ${itemsError.message}`
        }
      }
      
      console.log('✅ [DEBUG] Itens criados com sucesso')
    }
    
    revalidatePath('/sd/orders')
    
    console.log('✅ [DEBUG] Pedido atualizado com sucesso!')
    return {
      success: true,
      data: orderData
    }
    
  } catch (error: any) {
    console.log('❌ [DEBUG] Erro interno:', error)
    return {
      success: false,
      error: `Erro interno: ${error.message}`
    }
  }
}

export async function updateSalesOrderStatus(so_id: string, status: 'draft' | 'approved' | 'invoiced' | 'cancelled') {
  try {
    await requireSession()
    const supabase = getSupabaseClient()
    
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session?.user) {
      return {
        success: false,
        error: 'Usuário não autenticado'
      }
    }
    
    const tenant_id = session.session.user.user_metadata?.tenant_id || 'LaplataLunaria'
    
    // VALIDAÇÃO: Status enum
    if (!['draft', 'approved', 'invoiced', 'cancelled'].includes(status)) {
      return {
        success: false,
        error: 'Status inválido. Valores aceitos: draft, approved, invoiced, cancelled'
      }
    }
    
    const { data, error } = await supabase
      .from('sd_sales_order')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('tenant_id', tenant_id)
      .eq('so_id', so_id)
      .select('*')
      .single()
    
    if (error) {
      return {
        success: false,
        error: `Erro ao atualizar status: ${error.message}`
      }
    }
    
    revalidatePath('/sd')
    
    return {
      success: true,
      data
    }
    
  } catch (error: any) {
    return {
      success: false,
      error: `Erro interno: ${error.message}`
    }
  }
}
