"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { requireSession } from "@/lib/auth/requireSession"
import { toCents } from "@/lib/money"
import { revalidatePath } from "next/cache"

export async function createMaterial(formData: FormData) {
  await requireSession()
  
  const supabase = getSupabaseServerClient()
  
  const payload = {
    mm_material: String(formData.get("mm_material") ?? "").trim(),
    mm_comercial: String(formData.get("mm_comercial") ?? "").trim() || null,
    mm_desc: String(formData.get("mm_desc") ?? "").trim(),
    mm_mat_type: String(formData.get("mm_mat_type") ?? "").trim() || null,
    mm_mat_class: String(formData.get("mm_mat_class") ?? "").trim() || null,
    mm_price_cents: toCents(formData.get("mm_price")),
    mm_purchase_price_cents: toCents(formData.get("mm_purchase_price")),
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
  
  const supabase = getSupabaseServerClient()
  
  const payload = {
    mm_comercial: String(formData.get("mm_comercial") ?? "").trim() || null,
    mm_desc: String(formData.get("mm_desc") ?? "").trim(),
    mm_mat_type: String(formData.get("mm_mat_type") ?? "").trim() || null,
    mm_mat_class: String(formData.get("mm_mat_class") ?? "").trim() || null,
    mm_price_cents: toCents(formData.get("mm_price")),
    mm_purchase_price_cents: toCents(formData.get("mm_purchase_price")),
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
  
  const supabase = getSupabaseServerClient()
  
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

export async function updatePurchaseOrderStatus(po_id: string, formData: FormData) {
  await requireSession()
  
  const supabase = getSupabaseServerClient()
  
  const status = String(formData.get("status") ?? "").trim()

  const { error } = await supabase
    .from("mm_purchase_order")
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq("mm_order", po_id)

  if (error) {
    console.error("Erro ao atualizar status do pedido:", error)
    throw new Error(`Erro ao atualizar status: ${error.message}`)
  }

  revalidatePath("/mm/purchases")
  revalidatePath(`/mm/purchases/${po_id}`)
  
  return { success: true }
}

export async function getVendors() {
  await requireSession()
  
  const supabase = getSupabaseServerClient()
  
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
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("mm_material")
    .select("mm_material, mm_comercial, mm_desc, mm_price_cents, mm_purchase_price_cents")
    .eq("status", "active")
    .order("mm_material")
  if (error) {
    console.error("Erro ao buscar materiais:", error)
    return []
  }
  return data || []
}

export async function getCustomizingData() {
  await requireSession()
  
  const supabase = getSupabaseServerClient()
  
  // Buscar tipos de material
  const { data: types, error: typesError } = await supabase
    .from("mm_material")
    .select("mm_mat_type")
    .not("mm_mat_type", "is", null)
    .order("mm_mat_type")

  // Buscar classificações
  const { data: classifications, error: classificationsError } = await supabase
    .from("mm_material")
    .select("mm_mat_class")
    .not("mm_mat_class", "is", null)
    .order("mm_mat_class")

  if (typesError || classificationsError) {
    console.error("Erro ao buscar dados de customização:", typesError || classificationsError)
    // Fallback para dados padrão
    return {
      types: ['Brinco', 'Cordão', 'Choker', 'Gargantilha', 'Anel', 'Pulseira'],
      classifications: ['Elementar', 'Amuleto', 'Protetor', 'Decoração']
    }
  }

  // Extrair valores únicos
  const uniqueTypes = [...new Set(types?.map(t => t.mm_mat_type).filter(Boolean) || [])]
  const uniqueClassifications = [...new Set(classifications?.map(c => c.mm_mat_class).filter(Boolean) || [])]

  return {
    types: uniqueTypes.length > 0 ? uniqueTypes : ['Brinco', 'Cordão', 'Choker', 'Gargantilha', 'Anel', 'Pulseira'],
    classifications: uniqueClassifications.length > 0 ? uniqueClassifications : ['Elementar', 'Amuleto', 'Protetor', 'Decoração']
  }
}

export async function createPurchaseOrder(formData: FormData) {
  await requireSession()
  
  const supabase = getSupabaseServerClient()
  
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
      po_id: newPoId,
      vendor_id,
      order_date: po_date,
      expected_delivery: expected_delivery || null,
      notes: notes || null,
      status: 'draft'
    })
    .select('po_id')
    .single()

  if (orderError) {
    console.error('Error creating purchase order:', orderError)
    return { success: false, error: orderError.message }
  }

  revalidatePath('/mm/purchases')
  return { success: true, po_id: purchaseOrder.po_id }
}

export async function validateBulkMaterials(materials: any[]) {
  await requireSession()
  
  const supabase = getSupabaseServerClient()
  const validationResults = []
  
  for (let i = 0; i < materials.length; i++) {
    const material = materials[i]
    const result = {
      row_index: i,
      is_valid: true,
      error_message: null,
      generated_id: null
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
  
  const supabase = getSupabaseServerClient()
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
  
  const supabase = getSupabaseServerClient()
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
