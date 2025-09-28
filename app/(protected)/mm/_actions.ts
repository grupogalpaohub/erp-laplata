"use server"

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireSession } from "@/lib/auth/requireSession"
import { toCents } from "@/lib/money"
import { revalidatePath } from "next/cache"

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

export async function createMaterial(formData: FormData) {
  await requireSession()
  
  const supabase = getSupabaseClient()
  
  const payload = {
    mm_material: String(formData.get("mm_material") ?? "").trim(),
    mm_comercial: String(formData.get("mm_comercial") ?? "").trim() || null,
    mm_desc: String(formData.get("mm_desc") ?? "").trim(),
    mm_mat_type: String(formData.get("mm_mat_type") ?? "").trim() || null,
    mm_mat_class: String(formData.get("mm_mat_class") ?? "").trim() || null,
    mm_price_cents: toCents(Number(formData.get("mm_price") || 0)),
    mm_purchase_price_cents: toCents(Number(formData.get("mm_purchase_price") || 0)),
    mm_pur_link: String(formData.get("mm_pur_link") ?? "").trim() || null,
    commercial_name: String(formData.get("commercial_name") ?? "").trim() || null,
    lead_time_days: formData.get("lead_time_days") ? Number(formData.get("lead_time_days")) : null,
    mm_vendor_id: String(formData.get("mm_vendor_id") ?? "").trim() || null,
    status: String(formData.get("status") ?? "active").trim(),
  }

  const { data, error } = await supabase
    .from("mm_material")
    .insert(payload)
    .select("mm_material")
    .single()

  if (error) {
    console.error("Erro ao criar material:", error)
    throw new Error(`Erro ao criar material: ${error.message}`)
  }

  revalidatePath("/mm/catalog")
  revalidatePath("/mm/materials")
  
  return { success: true, mm_material: data.mm_material }
}

export async function updateMaterial(mm_material: string, formData: FormData) {
  await requireSession()
  
  const supabase = getSupabaseClient()
  
  const payload = {
    mm_comercial: String(formData.get("mm_comercial") ?? "").trim() || null,
    mm_desc: String(formData.get("mm_desc") ?? "").trim(),
    mm_mat_type: String(formData.get("mm_mat_type") ?? "").trim() || null,
    mm_mat_class: String(formData.get("mm_mat_class") ?? "").trim() || null,
    mm_price_cents: toCents(Number(formData.get("mm_price") || 0)),
    mm_purchase_price_cents: toCents(Number(formData.get("mm_purchase_price") || 0)),
    mm_pur_link: String(formData.get("mm_pur_link") ?? "").trim() || null,
    commercial_name: String(formData.get("commercial_name") ?? "").trim() || null,
    lead_time_days: formData.get("lead_time_days") ? Number(formData.get("lead_time_days")) : null,
    mm_vendor_id: String(formData.get("mm_vendor_id") ?? "").trim() || null,
    status: String(formData.get("status") ?? "active").trim(),
  }

  const { error } = await supabase
    .from("mm_material")
    .update(payload)
    .eq("mm_material", mm_material)

  if (error) {
    console.error("Erro ao atualizar material:", error)
    throw new Error(`Erro ao atualizar material: ${error.message}`)
  }

  revalidatePath("/mm/catalog")
  revalidatePath(`/mm/materials/${mm_material}`)
  
  return { success: true }
}

export async function deleteMaterial(mm_material: string) {
  await requireSession()
  
  const supabase = getSupabaseClient()
  
  const { error } = await supabase
    .from("mm_material")
    .delete()
    .eq("mm_material", mm_material)

  if (error) {
    console.error("Erro ao deletar material:", error)
    throw new Error(`Erro ao deletar material: ${error.message}`)
  }

  revalidatePath("/mm/catalog")
  revalidatePath("/mm/materials")
  
  return { success: true }
}

export async function updatePurchaseOrderStatus(mm_order: string, formData: FormData) {
  await requireSession()
  
  const supabase = getSupabaseClient()
  
  const status = String(formData.get("status") ?? "").trim()

  const { error } = await supabase
    .from("mm_purchase_order")
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq("mm_order", mm_order)

  if (error) {
    console.error("Erro ao atualizar status do pedido:", error)
    throw new Error(`Erro ao atualizar status: ${error.message}`)
  }

  revalidatePath("/mm/purchases")
  revalidatePath(`/mm/purchases/${mm_order}`)
  
  return { success: true }
}

export async function getVendors() {
  await requireSession()
  
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from("mm_vendor")
    .select("vendor_id, vendor_name")
    .eq("status", "active")
    .order("vendor_name")

  if (error) {
    console.error("Erro ao buscar fornecedores:", error)
    return []
  }

  return data || []
}

export async function getMaterials() {
  await requireSession()
  const supabase = getSupabaseClient()
  
  // Obter tenant_id da sessão
  const { data: { session } } = await supabase.auth.getSession()
  const tenant_id = session?.user?.user_metadata?.tenant_id || 'LaplataLunaria'
  
  const { data, error } = await supabase
    .from("mm_material")
    .select("mm_material, mm_comercial, mm_desc, mm_price_cents, mm_purchase_price_cents")
    .eq("tenant_id", tenant_id)
    .eq("status", "active")
    .order("mm_material")
    
  if (error) {
    console.error("Erro ao buscar materiais:", error)
    return []
  }
  
  // Garantir que sempre retorna um array
  return Array.isArray(data) ? data : []
}

export async function getCustomizingData() {
  await requireSession()
  
  const supabase = getSupabaseClient()
  
  // Buscar tipos de material da tabela de definição
  const { data: types, error: typesError } = await supabase
    .from("mm_category_def")
    .select("category")
    .eq("is_active", true)
    .order("category")

  // Buscar classificações da tabela de definição
  const { data: classifications, error: classificationsError } = await supabase
    .from("mm_classification_def")
    .select("classification")
    .eq("is_active", true)
    .order("classification")

  if (typesError || classificationsError) {
    console.error("Erro ao buscar dados de customização:", typesError || classificationsError)
    // Fallback para dados padrão
    return {
      types: ['Brinco', 'Choker', 'Kit', 'Gargantilha', 'Pulseira'],
      classifications: ['Amuletos', 'Elementar', 'Ciclos', 'Ancestral']
    }
  }

  // Extrair valores únicos
  const uniqueTypes = types?.map(t => t.category).filter(Boolean) || []
  const uniqueClassifications = classifications?.map(c => c.classification).filter(Boolean) || []

  return {
    types: uniqueTypes.length > 0 ? uniqueTypes : ['Brinco', 'Choker', 'Kit', 'Gargantilha', 'Pulseira'],
    classifications: uniqueClassifications.length > 0 ? uniqueClassifications : ['Amuletos', 'Elementar', 'Ciclos', 'Ancestral']
  }
}

export async function createPurchaseOrder(formData: FormData) {
  await requireSession()
  
  const supabase = getSupabaseClient()
  
  const vendor_id = String(formData.get("vendor_id") ?? "")
  const po_date = String(formData.get("po_date") ?? "")
  const expected_delivery = String(formData.get("expected_delivery") ?? "")
  const notes = String(formData.get("notes") ?? "")
  
  // Gerar ID único baseado em timestamp
  const timestamp = Date.now()
  const newPoId = `PO-${timestamp}`

  // Criar pedido de compra
  const { data: purchaseOrder, error: orderError } = await supabase
    .from('mm_purchase_order')
    .insert({
      mm_order: newPoId,
      vendor_id,
      order_date: po_date,
      po_date: po_date,
      expected_delivery: expected_delivery || null,
      notes: notes || null,
      status: 'draft',
      total_amount: 0,
      currency: 'BRL',
      total_cents: 0
    })
    .select('mm_order')
    .single()

  if (orderError) {
    console.error('Error creating purchase order:', orderError)
    return { success: false, error: orderError.message }
  }

  revalidatePath('/mm/purchases')
  return { success: true, mm_order: purchaseOrder.mm_order }
}

export async function validateBulkMaterials(materials: any[]) {
  await requireSession()
  
  const supabase = getSupabaseClient()
  const validationResults = []
  
  for (let i = 0; i < materials.length; i++) {
    const material = materials[i]
    const result = {
      row_index: i,
      is_valid: true,
      error_message: null as string | null,
      generated_id: null as string | null
    }
    
    // Validações básicas
    if (!material.mm_comercial?.trim()) {
      result.is_valid = false
      result.error_message = 'Nome comercial é obrigatório'
    } else if (!material.mm_desc?.trim()) {
      result.is_valid = false
      result.error_message = 'Descrição é obrigatória'
    } else if (!material.mm_vendor_id?.trim()) {
      result.is_valid = false
      result.error_message = 'Fornecedor é obrigatório'
    } else {
      // Gerar ID único
      result.generated_id = `MAT-${Date.now()}-${i}`
    }
    
    validationResults.push(result)
  }
  
  return validationResults
}

export async function bulkImportMaterials(materials: any[]) {
  await requireSession()
  
  const supabase = getSupabaseClient()
  const results = []
  
  for (const material of materials) {
    try {
      const { data, error } = await supabase
        .from('mm_material')
        .insert({
          mm_material: material.mm_material,
          mm_comercial: material.mm_comercial,
          mm_desc: material.mm_desc,
          mm_mat_type: material.mm_mat_type,
          mm_mat_class: material.mm_mat_class,
          mm_vendor_id: material.mm_vendor_id,
          mm_price_cents: toCents(material.mm_price),
          mm_purchase_price_cents: toCents(material.mm_purchase_price),
          mm_pur_link: material.mm_pur_link || null,
          lead_time_days: Number(material.lead_time_days) || 0,
          status: material.status || 'active'
        })
        .select('mm_material')
        .single()
      
      if (error) {
        results.push({ success: false, error: error.message, material: material.mm_material })
      } else {
        results.push({ success: true, material: data.mm_material })
      }
    } catch (err) {
      results.push({ success: false, error: 'Erro interno', material: material.mm_material })
    }
  }
  
  revalidatePath('/mm/materials')
  return results
}

export async function bulkUpdateMaterials(updates: any[]) {
  await requireSession()
  
  const supabase = getSupabaseClient()
  const results = []
  
  for (const update of updates) {
    try {
      const { data, error } = await supabase
        .from('mm_material')
        .update({
          mm_comercial: update.mm_comercial,
          mm_desc: update.mm_desc,
          mm_mat_type: update.mm_mat_type,
          mm_mat_class: update.mm_mat_class,
          mm_vendor_id: update.mm_vendor_id,
          mm_price_cents: toCents(update.mm_price),
          mm_purchase_price_cents: toCents(update.mm_purchase_price),
          mm_pur_link: update.mm_pur_link || null,
          lead_time_days: Number(update.lead_time_days) || 0,
          status: update.status || 'active'
        })
        .eq('mm_material', update.mm_material)
        .select('mm_material')
        .single()
      
      if (error) {
        results.push({ success: false, error: error.message, material: update.mm_material })
      } else {
        results.push({ success: true, material: data.mm_material })
      }
    } catch (err) {
      results.push({ success: false, error: 'Erro interno', material: update.mm_material })
    }
  }
  
  revalidatePath('/mm/materials')
  return results
}
