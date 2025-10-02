// app/(protected)/mm/_wizard-actions.ts
// Server Actions para wizard de Purchase Orders (Header + Itens em transação)
// GUARDRAIL COMPLIANCE: @supabase/ssr + cookies()

"use server"

import { supabaseServer } from '@/lib/supabase/server'
import { requireSession } from "@/lib/auth/requireSession"
import { revalidatePath } from "next/cache"
import { MM_PurchaseOrder, MM_PurchaseOrderItem } from '@/src/types/db'

// Helper function para criar cliente Supabase com guardrails compliance
function getSupabaseClient() {
  return supabaseServer()
}

export interface WizardPOData {
  header: {
    mm_order: string
    vendor_id: string
    order_date: string
    status?: string
    po_date?: string
    expected_delivery?: string
    notes?: string
    total_amount?: number
    currency?: string
    total_cents?: number
  }
  items: Array<{
    po_item_id: number
    plant_id: string
    mm_material: string
    mm_qtt: string
    unit_cost_cents: number
    line_total_cents: number
    notes?: string
    currency?: string
    quantity?: number
    material_id?: string
    freeze_item_price?: boolean
  }>
}

export async function createPurchaseOrderWizard(data: WizardPOData) {
  try {
    await requireSession()
    const supabase = getSupabaseClient()
    
    // VALIDAÇÃO: Header obrigatório
    const requiredHeaderFields = ['mm_order', 'vendor_id', 'order_date']
    const missingHeaderFields = requiredHeaderFields.filter(field => !data.header[field as keyof typeof data.header])
    
    if (missingHeaderFields.length > 0) {
      return {
        success: false,
        error: `Header PO - Campos obrigatórios ausentes: ${missingHeaderFields.join(', ')}`
      }
    }
    
    // VALIDAÇÃO: Pelo menos um item
    if (!data.items || data.items.length === 0) {
      return {
        success: false,
        error: 'Pelo menos um item é obrigatório'
      }
    }
    
    // VALIDAÇÃO: Itens obrigatórios
    const requiredItemFields = ['po_item_id', 'plant_id', 'mm_material', 'mm_qtt', 'unit_cost_cents', 'line_total_cents']
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i]
      const missingItemFields = requiredItemFields.filter(field => !item[field as keyof typeof item])
      
      if (missingItemFields.length > 0) {
        return {
          success: false,
          error: `Item ${i + 1} - Campos obrigatórios ausentes: ${missingItemFields.join(', ')}`
        }
      }
    }
    
    // INICIAR TRANSAÇÃO
    const { data: session } = await supabase.auth.getSession()
    if (!session?.session?.user) {
      return {
        success: false,
        error: 'Usuário não autenticado'
      }
    }
    
    const tenant_id = session.session.user.user_metadata?.tenant_id || 'LaplataLunaria'
    
    // 1. CRIAR HEADER PO
    const po: MM_PurchaseOrder = {
      tenant_id,
      mm_order: data.header.mm_order,
      vendor_id: data.header.vendor_id,
      order_date: data.header.order_date,
      status: data.header.status ?? null,
      po_date: data.header.po_date ?? null,
      expected_delivery: data.header.expected_delivery ?? null,
      notes: data.header.notes ?? null,
      total_amount: data.header.total_amount ?? null,
      currency: data.header.currency ?? null,
      total_cents: data.header.total_cents ?? null,
    }
    
    const { data: createdPO, error: poError } = await supabase
      .from('mm_purchase_order')
      .insert(po)
      .select('*')
      .single()
    
    if (poError) {
      return {
        success: false,
        error: `Erro ao criar PO: ${poError.message}`
      }
    }
    
    // 2. CRIAR ITENS PO
    const items: MM_PurchaseOrderItem[] = data.items.map(item => ({
      tenant_id,
      po_item_id: item.po_item_id,
      mm_order: data.header.mm_order,
      plant_id: item.plant_id,
      mm_material: item.mm_material,
      mm_qtt: item.mm_qtt,
      unit_cost_cents: item.unit_cost_cents,
      line_total_cents: item.line_total_cents,
      notes: item.notes ?? null,
      currency: item.currency ?? null,
      quantity: item.quantity ?? null,
      material_id: item.material_id ?? null,
      freeze_item_price: item.freeze_item_price ?? null,
    }))
    
    const { data: createdItems, error: itemsError } = await supabase
      .from('mm_purchase_order_item')
      .insert(items)
      .select('*')
    
    if (itemsError) {
      // ROLLBACK: Deletar PO criada
      await supabase
        .from('mm_purchase_order')
        .delete()
        .eq('tenant_id', tenant_id)
        .eq('mm_order', data.header.mm_order)
      
      return {
        success: false,
        error: `Erro ao criar itens: ${itemsError.message}`
      }
    }
    
    // 3. SUCESSO
    revalidatePath('/mm/purchases')
    
    return {
      success: true,
      data: {
        po: createdPO,
        items: createdItems,
        total_items: createdItems?.length || 0
      }
    }
    
  } catch (error: any) {
    return {
      success: false,
      error: `Erro interno: ${error.message}`
    }
  }
}

export async function deletePurchaseOrderCascade(mm_order: string) {
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
    
    // 1. DELETAR ITENS PRIMEIRO
    const { error: itemsError } = await supabase
      .from('mm_purchase_order_item')
      .delete()
      .eq('tenant_id', tenant_id)
      .eq('mm_order', mm_order)
    
    if (itemsError) {
      return {
        success: false,
        error: `Erro ao deletar itens: ${itemsError.message}`
      }
    }
    
    // 2. DELETAR HEADER
    const { error: poError } = await supabase
      .from('mm_purchase_order')
      .delete()
      .eq('tenant_id', tenant_id)
      .eq('mm_order', mm_order)
    
    if (poError) {
      return {
        success: false,
        error: `Erro ao deletar PO: ${poError.message}`
      }
    }
    
    revalidatePath('/mm/purchases')
    
    return {
      success: true,
      data: { deleted: true, mm_order }
    }
    
  } catch (error: any) {
    return {
      success: false,
      error: `Erro interno: ${error.message}`
    }
  }
}
