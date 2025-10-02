// app/(protected)/sd/_actions.ts
// Server Actions para SD (Sales & Distribution)
// GUARDRAIL COMPLIANCE: @supabase/ssr + cookies()

"use server"

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireSession } from "@/lib/auth/requireSession"
import { revalidatePath } from "next/cache"
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
    const customer_id = formData.get('customer_id') as string
    const status = formData.get('status') as string || 'draft'
    
    if (!so_id || !customer_id) {
      return {
        success: false,
        error: 'so_id e customer_id são obrigatórios'
      }
    }
    
    // VALIDAÇÃO: Status enum
    if (!['draft', 'approved', 'invoiced', 'cancelled'].includes(status)) {
      return {
        success: false,
        error: 'Status inválido. Valores aceitos: draft, approved, invoiced, cancelled'
      }
    }
    
    const salesOrder: SD_SalesOrder = {
      tenant_id,
      so_id,
      customer_id,
      status: status as 'draft' | 'approved' | 'invoiced' | 'cancelled',
      order_date: formData.get('order_date') as string || new Date().toISOString().slice(0, 10),
      expected_ship: formData.get('expected_ship') as string || null,
      total_cents: 0, // Será calculado pela trigger
      doc_no: formData.get('doc_no') as string || null,
      payment_method: formData.get('payment_method') as string || null,
      payment_term: formData.get('payment_term') as string || null,
      total_negotiated_cents: 0,
      notes: formData.get('notes') as string || null,
    }
    
    const { data, error } = await supabase
      .from('sd_sales_order')
      .insert(salesOrder)
      .select('*')
      .single()
    
    if (error) {
      return {
        success: false,
        error: `Erro ao criar Sales Order: ${error.message}`
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
