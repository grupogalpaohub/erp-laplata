"use server"

import { supabaseServer } from '@/utils/supabase/server'
import { requireSession } from "@/lib/auth/requireSession"
import { revalidatePath } from "next/cache"

export async function createCustomer(formData: FormData) {
  await requireSession()
  
  const supabase = supabaseServer()
  
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    customer_type: String(formData.get("customer_type") ?? "PF").trim(),
    email: String(formData.get("email") ?? "").trim(),
    tax_id: String(formData.get("tax_id") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    city: String(formData.get("city") ?? "").trim() || null,
    state: String(formData.get("state") ?? "").trim() || null,
    country: String(formData.get("country") ?? "Brasil").trim(),
    zip_code: String(formData.get("zip_code") ?? "").trim() || null,
    is_active: formData.get("is_active") === "on" ? true : false,
    // Campos opcionais
    sales_channel: String(formData.get("sales_channel") ?? "").trim() || null,
    payment_method_pref: String(formData.get("payment_method_pref") ?? "").trim() || null,
    payment_terms: String(formData.get("payment_terms") ?? "").trim() || null,
    customer_category: String(formData.get("customer_category") ?? "").trim() || null,
    state_registration: String(formData.get("state_registration") ?? "").trim() || null,
    municipal_registration: String(formData.get("municipal_registration") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "").trim() || null,
  }

  const { data, error } = await supabase
    .from("crm_customer")
    .insert(payload)
    .select("customer_id")
    .single()

  if (error) {
    console.error("Erro ao criar cliente:", error)
    throw new Error(`Erro ao criar cliente: ${error.message}`)
  }

  revalidatePath("/crm/customers")
  revalidatePath("/crm")
  
  return { success: true, customer_id: data.customer_id }
}

export async function updateCustomer(customer_id: string, formData: FormData) {
  await requireSession()
  
  const supabase = supabaseServer()
  
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    customer_type: String(formData.get("customer_type") ?? "PF").trim(),
    email: String(formData.get("email") ?? "").trim(),
    tax_id: String(formData.get("tax_id") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim() || null,
    address: String(formData.get("address") ?? "").trim() || null,
    city: String(formData.get("city") ?? "").trim() || null,
    state: String(formData.get("state") ?? "").trim() || null,
    country: String(formData.get("country") ?? "Brasil").trim(),
    zip_code: String(formData.get("zip_code") ?? "").trim() || null,
    is_active: formData.get("is_active") === "on" ? true : false,
    // Campos opcionais
    sales_channel: String(formData.get("sales_channel") ?? "").trim() || null,
    payment_method_pref: String(formData.get("payment_method_pref") ?? "").trim() || null,
    payment_terms: String(formData.get("payment_terms") ?? "").trim() || null,
    customer_category: String(formData.get("customer_category") ?? "").trim() || null,
    state_registration: String(formData.get("state_registration") ?? "").trim() || null,
    municipal_registration: String(formData.get("municipal_registration") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "").trim() || null,
  }

  const { error } = await supabase
    .from("crm_customer")
    .update(payload)
    .eq("customer_id", customer_id)

  if (error) {
    console.error("Erro ao atualizar cliente:", error)
    throw new Error(`Erro ao atualizar cliente: ${error.message}`)
  }

  revalidatePath("/crm/customers")
  revalidatePath(`/crm/customers/${customer_id}`)
  
  return { success: true }
}

export async function deleteCustomer(customer_id: string) {
  await requireSession()
  
  const supabase = supabaseServer()
  
  const { error } = await supabase
    .from("crm_customer")
    .delete()
    .eq("customer_id", customer_id)

  if (error) {
    console.error("Erro ao deletar cliente:", error)
    throw new Error(`Erro ao deletar cliente: ${error.message}`)
  }

  revalidatePath("/crm/customers")
  revalidatePath("/crm")
  
  return { success: true }
}

export async function toggleCustomerStatus(customer_id: string, is_active: boolean) {
  await requireSession()
  
  const supabase = supabaseServer()
  
  const { error } = await supabase
    .from("crm_customer")
    .update({ is_active })
    .eq("customer_id", customer_id)

  if (error) {
    console.error("Erro ao alterar status do cliente:", error)
    throw new Error(`Erro ao alterar status: ${error.message}`)
  }

  revalidatePath("/crm/customers")
  revalidatePath(`/crm/customers/${customer_id}`)
  
  return { success: true }
}
